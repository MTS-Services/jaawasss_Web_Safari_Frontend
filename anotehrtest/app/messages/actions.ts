"use server"

import { generateText, Output } from "ai"
import { z } from "zod"

// Fast, capable model available zero-config through the Vercel AI Gateway.
const MODEL = "google/gemini-3.5-flash"

export type ChatTurn = { sender: "buyer" | "supplier"; text: string }

export type DealContext = {
  supplierName: string
  product: string
  quantity: string
  pricePerUnit: string
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  zh: "Chinese (Simplified)",
  fr: "French",
  de: "German",
  ar: "Arabic",
  hi: "Hindi",
  pt: "Portuguese",
  ja: "Japanese",
  it: "Italian",
}

function dealLine(ctx: DealContext) {
  return `Deal context — buyer is sourcing "${ctx.product}", quantity ${ctx.quantity}, around ${ctx.pricePerUnit} per unit, from supplier "${ctx.supplierName}".`
}

function transcript(history: ChatTurn[], ctx: DealContext) {
  if (!history.length) return "No prior messages yet."
  return history
    .map((m) => `${m.sender === "buyer" ? "Buyer" : ctx.supplierName}: ${m.text}`)
    .join("\n")
}

const BASE_SYSTEM =
  "You are an expert B2B sourcing assistant embedded in a messaging app on SourceNest, a global marketplace connecting buyers with manufacturers and service providers. " +
  "You help the BUYER communicate clearly and professionally with suppliers. Keep a warm, confident, business-appropriate tone. " +
  "Never invent prices, certifications, or commitments. Use neutral placeholders like [destination] or [your address] when a concrete detail is unknown."

/** Rewrite the buyer's draft into a polished, professional supplier message. */
export async function improveMessage(draft: string, ctx: DealContext): Promise<string> {
  if (!draft.trim()) return draft
  const { text } = await generateText({
    model: MODEL,
    system: BASE_SYSTEM,
    prompt:
      `${dealLine(ctx)}\n\n` +
      `Rewrite the buyer's draft below into a clear, professional, friendly message to the supplier. ` +
      `Keep it concise (1–4 sentences unless the draft clearly needs more). Preserve the buyer's intent and any specifics they included. ` +
      `Return ONLY the rewritten message text with no quotes, labels, or commentary.\n\n` +
      `Draft: "${draft.trim()}"`,
  })
  return text.trim()
}

/** Translate (and lightly clean up) the buyer's draft into the target language. */
export async function translateMessage(draft: string, targetLang: string, ctx: DealContext): Promise<string> {
  if (!draft.trim()) return draft
  const langName = LANGUAGE_NAMES[targetLang] ?? "English"
  const { text } = await generateText({
    model: MODEL,
    system: BASE_SYSTEM,
    prompt:
      `${dealLine(ctx)}\n\n` +
      `Translate the buyer's message below into ${langName}. If it is already in ${langName}, fix grammar and make it read naturally and professionally. ` +
      `Keep the meaning faithful. Return ONLY the translated message text with no quotes or commentary.\n\n` +
      `Message: "${draft.trim()}"`,
  })
  return text.trim()
}

/** Improve AND translate to professional English in one pass. */
export async function improveAndTranslate(draft: string, ctx: DealContext): Promise<string> {
  if (!draft.trim()) return draft
  const { text } = await generateText({
    model: MODEL,
    system: BASE_SYSTEM,
    prompt:
      `${dealLine(ctx)}\n\n` +
      `The buyer's draft below may be in another language or broken English. Translate it to English AND rewrite it as a polished, professional message to the supplier. ` +
      `Keep it concise and preserve intent. Return ONLY the final message text with no quotes or commentary.\n\n` +
      `Draft: "${draft.trim()}"`,
  })
  return text.trim()
}

/** Suggest a full reply to the supplier's latest message, using the conversation. */
export async function suggestReply(history: ChatTurn[], ctx: DealContext): Promise<string> {
  const lastSupplier = [...history].reverse().find((m) => m.sender === "supplier")
  if (!lastSupplier) {
    return "Hello, thank you for connecting. I'd love to learn more about your products. Could you please share pricing, MOQ, and lead times?"
  }
  const { text } = await generateText({
    model: MODEL,
    system: BASE_SYSTEM,
    prompt:
      `${dealLine(ctx)}\n\n` +
      `Conversation so far:\n${transcript(history, ctx)}\n\n` +
      `Write the BUYER's next reply to the supplier's most recent message. Be professional and specific, move the deal forward, ` +
      `and ask any natural follow-up questions. Use placeholders like [destination] where a concrete detail is unknown. ` +
      `Return ONLY the reply message text with no quotes or commentary.`,
  })
  return text.trim()
}

/** Analyze the conversation and suggest the best next question / message to send. */
export async function smartHelp(history: ChatTurn[], ctx: DealContext): Promise<string> {
  const { text } = await generateText({
    model: MODEL,
    system: BASE_SYSTEM,
    prompt:
      `${dealLine(ctx)}\n\n` +
      `Conversation so far:\n${transcript(history, ctx)}\n\n` +
      `Identify the most important topic the buyer has NOT yet covered (e.g. pricing, MOQ, samples, shipping/Incoterms, payment terms, lead time, certifications). ` +
      `Write a ready-to-send professional message the buyer can use to ask about it. ` +
      `Return ONLY the message text with no quotes, labels, or commentary.`,
  })
  return text.trim()
}

/** Context-aware mini chat: returns advice plus an optional ready-to-send reply. */
export async function assistantChat(
  question: string,
  history: ChatTurn[],
  ctx: DealContext,
): Promise<{ response: string; suggestion: string | null }> {
  const { experimental_output } = await generateText({
    model: MODEL,
    system:
      BASE_SYSTEM +
      " You are now acting as a private advisor chatting with the buyer (the supplier cannot see this). " +
      "Give short, practical guidance. When the buyer would benefit from a ready-to-send message, also provide one.",
    prompt:
      `${dealLine(ctx)}\n\n` +
      `Conversation with the supplier so far:\n${transcript(history, ctx)}\n\n` +
      `The buyer asks you privately: "${question.trim()}"\n\n` +
      `Respond with helpful, concise advice (2–6 short lines, you may use simple bullet points). ` +
      `If a ready-to-send message to the supplier would help, put it in "suggestion"; otherwise set suggestion to null.`,
    experimental_output: Output.object({
      schema: z.object({
        response: z.string().describe("Concise advice for the buyer"),
        suggestion: z
          .string()
          .nullable()
          .describe("A ready-to-send message to the supplier, or null if not applicable"),
      }),
    }),
  })
  return {
    response: experimental_output.response.trim(),
    suggestion: experimental_output.suggestion?.trim() || null,
  }
}
