"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  X,
  RotateCcw,
  Check,
  ChevronRight,
  AlertTriangle,
  Loader2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import ReviewCodeOverlay from "./review-code-overlay"

export interface CapturedPhoto {
  areaName: string
  blob: Blob
  previewUrl: string
}

interface LiveCaptureProps {
  reviewCode: string
  areas: string[]
  onComplete: (captures: CapturedPhoto[]) => void
  onCancel: () => void
}

/**
 * Live camera capture component.
 * Opens the device camera (rear-facing) directly — gallery uploads are NOT allowed.
 * Shows the review code overlay in every frame.
 */
export default function LiveCapture({
  reviewCode,
  areas,
  onComplete,
  onCancel,
}: LiveCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [currentAreaIndex, setCurrentAreaIndex] = useState(0)
  const [captures, setCaptures] = useState<CapturedPhoto[]>([])
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [capturing, setCapturing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [lastPreview, setLastPreview] = useState<string | null>(null)

  const currentArea = areas[currentAreaIndex]
  const currentAreaCaptures = captures.filter((c) => c.areaName === currentArea)
  const MAX_PHOTOS_PER_AREA = 5

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      setCameraReady(false)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setCameraReady(true)
      }
    } catch (err) {
      console.error("Camera access error:", err)
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setCameraError(
            "Camera access was denied. Please allow camera access in your browser settings to proceed with the review."
          )
        } else if (err.name === "NotFoundError") {
          setCameraError(
            "No camera found on this device. A camera is required for live capture reviews."
          )
        } else {
          setCameraError(`Camera error: ${err.message}`)
        }
      } else {
        setCameraError("Failed to access camera. Please try again.")
      }
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraReady(false)
  }, [])

  // Start camera on mount
  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  // Take photo
  const takePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return

    setCapturing(true)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas to video dimensions
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Draw review code overlay on the canvas
      const overlayPadding = 16
      const fontSize = Math.max(20, canvas.width * 0.025)
      const timestampFontSize = Math.max(12, canvas.width * 0.015)

      // Background rectangle
      const codeText = reviewCode
      ctx.font = `bold ${fontSize}px monospace`
      const codeWidth = ctx.measureText(codeText).width

      const now = new Date()
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

      ctx.font = `${timestampFontSize}px monospace`
      const tsWidth = ctx.measureText(timestamp).width
      const boxWidth = Math.max(codeWidth, tsWidth) + overlayPadding * 3
      const boxHeight = fontSize + timestampFontSize + overlayPadding * 2.5

      const boxX = canvas.width - boxWidth - overlayPadding
      const boxY = overlayPadding

      // Semi-transparent background
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.beginPath()
      const radius = 8
      ctx.moveTo(boxX + radius, boxY)
      ctx.lineTo(boxX + boxWidth - radius, boxY)
      ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + radius)
      ctx.lineTo(boxX + boxWidth, boxY + boxHeight - radius)
      ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - radius, boxY + boxHeight)
      ctx.lineTo(boxX + radius, boxY + boxHeight)
      ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - radius)
      ctx.lineTo(boxX, boxY + radius)
      ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY)
      ctx.closePath()
      ctx.fill()

      // Code text
      ctx.font = `bold ${fontSize}px monospace`
      ctx.fillStyle = "white"
      ctx.textAlign = "right"
      ctx.fillText(codeText, canvas.width - overlayPadding * 2, boxY + overlayPadding + fontSize * 0.8)

      // Timestamp
      ctx.font = `${timestampFontSize}px monospace`
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      ctx.fillText(
        timestamp,
        canvas.width - overlayPadding * 2,
        boxY + overlayPadding + fontSize + timestampFontSize * 0.8 + 4
      )

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else reject(new Error("Failed to create image"))
          },
          "image/jpeg",
          0.92
        )
      })

      const previewUrl = URL.createObjectURL(blob)

      const newCapture: CapturedPhoto = {
        areaName: currentArea,
        blob,
        previewUrl,
      }

      setCaptures((prev) => [...prev, newCapture])
      setLastPreview(previewUrl)
      setShowPreview(true)

      // Auto-hide preview after 1.5s
      setTimeout(() => {
        setShowPreview(false)
        setLastPreview(null)
      }, 1500)
    } catch (err) {
      console.error("Capture error:", err)
    } finally {
      setCapturing(false)
    }
  }

  // Remove a specific capture
  const removeCapture = (index: number) => {
    setCaptures((prev) => {
      const newCaptures = [...prev]
      URL.revokeObjectURL(newCaptures[index].previewUrl)
      newCaptures.splice(index, 1)
      return newCaptures
    })
  }

  // Next area
  const nextArea = () => {
    if (currentAreaIndex < areas.length - 1) {
      setCurrentAreaIndex((p) => p + 1)
    }
  }

  // Previous area
  const prevArea = () => {
    if (currentAreaIndex > 0) {
      setCurrentAreaIndex((p) => p - 1)
    }
  }

  // Finish and submit all captures
  const handleFinish = () => {
    stopCamera()
    onComplete(captures)
  }

  // Total captures across all areas
  const totalCaptures = captures.length
  const allAreasCovered = areas.every((area) => captures.some((c) => c.areaName === area))

  // Camera error state
  if (cameraError) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black p-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">Camera Unavailable</h3>
          <p className="mt-2 text-sm text-white/70">{cameraError}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={startCamera} variant="secondary">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={onCancel} variant="ghost" className="text-white/60 hover:text-white">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-black">
      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-4 pb-10 pt-4">
        <Button
          size="sm"
          variant="ghost"
          className="h-9 text-white hover:bg-white/10"
          onClick={() => {
            stopCamera()
            onCancel()
          }}
        >
          <X className="mr-1.5 h-4 w-4" />
          Cancel
        </Button>

        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-white/60">
            Area {currentAreaIndex + 1} of {areas.length}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-white">{currentArea}</p>
        </div>

        <Badge className="bg-white/10 text-white backdrop-blur-sm">
          <ImageIcon className="mr-1 h-3 w-3" />
          {totalCaptures}
        </Badge>
      </div>

      {/* Camera preview */}
      <div className="relative flex-1 overflow-hidden">
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white/50" />
          </div>
        )}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={cn(
            "h-full w-full object-cover transition-opacity",
            cameraReady ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Review code overlay — visible on screen and burned into captures */}
        <ReviewCodeOverlay code={reviewCode} />

        {/* Flash effect on capture */}
        {showPreview && lastPreview && (
          <div className="absolute inset-0 z-10 animate-in fade-in duration-150">
            <img
              src={lastPreview}
              alt="Captured"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/80">
                <Check className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent px-4 pb-8 pt-16">
        {/* Thumbnail strip for current area */}
        {currentAreaCaptures.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {currentAreaCaptures.map((cap, i) => {
              const globalIndex = captures.findIndex(
                (c) => c === cap
              )
              return (
                <div key={i} className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/20">
                  <img src={cap.previewUrl} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeCapture(globalIndex)}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          {/* Previous area */}
          <Button
            size="sm"
            variant="ghost"
            className="w-20 text-white/70 hover:bg-white/10 hover:text-white"
            disabled={currentAreaIndex === 0}
            onClick={prevArea}
          >
            Back
          </Button>

          {/* Capture button */}
          <button
            type="button"
            onClick={takePhoto}
            disabled={!cameraReady || capturing || currentAreaCaptures.length >= MAX_PHOTOS_PER_AREA}
            className={cn(
              "flex h-18 w-18 items-center justify-center rounded-full border-4 border-white/80 transition-all active:scale-95",
              capturing
                ? "bg-white/30"
                : currentAreaCaptures.length >= MAX_PHOTOS_PER_AREA
                  ? "border-white/30 bg-white/10"
                  : "bg-white/20 hover:bg-white/30"
            )}
          >
            {capturing ? (
              <Loader2 className="h-7 w-7 animate-spin text-white" />
            ) : (
              <Camera className="h-7 w-7 text-white" />
            )}
          </button>

          {/* Next area / Finish */}
          {currentAreaIndex < areas.length - 1 ? (
            <Button
              size="sm"
              variant="ghost"
              className="w-20 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={nextArea}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-20 bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={totalCaptures === 0}
              onClick={handleFinish}
            >
              Done
              <Check className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Photo count */}
        <p className="mt-3 text-center text-xs text-white/50">
          {currentAreaCaptures.length} / {MAX_PHOTOS_PER_AREA} photos for this area •{" "}
          {allAreasCovered
            ? "All areas covered ✓"
            : `${areas.filter((a) => captures.some((c) => c.areaName === a)).length} / ${areas.length} areas`}
        </p>
      </div>
    </div>
  )
}
