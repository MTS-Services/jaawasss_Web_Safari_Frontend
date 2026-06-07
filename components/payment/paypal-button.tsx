'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PayPalButtonProps {
  amount: number;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  currency?: string;
  className?: string;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => {
        render: (selector: string | HTMLElement) => Promise<void>;
      };
    };
  }
}

let sdkLoadPromise: Promise<void> | null = null;

export function PayPalButton({
  amount,
  onSuccess,
  onError,
  currency = 'USD',
  className = '',
}: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);
  const buttonRenderedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    // Guard: already rendered - handles React StrictMode double-invoke in dev
    // buttonRenderedRef is intentionally NOT reset in cleanup so the 2nd run skips
    if (buttonRenderedRef.current) {
      setIsLoading(false);
      return;
    }

    const initPayPal = async () => {
      try {
        const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
        if (!clientId) throw new Error('PayPal Client ID not configured');

        if (!sdkLoadPromise) {
          sdkLoadPromise = new Promise<void>((resolve, reject) => {
            if (window.paypal?.Buttons) {
              resolve();
              return;
            }
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
            script.async = true;
            script.onload = () => {
              let retries = 0;
              const check = () => {
                if (window.paypal?.Buttons) resolve();
                else if (retries++ < 10) setTimeout(check, 100);
                else reject(new Error('PayPal SDK failed to initialize'));
              };
              check();
            };
            script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
            document.body.appendChild(script);
          });
        }

        await sdkLoadPromise;

        // Component may have unmounted during async wait
        if (!isMountedRef.current || !containerRef.current) return;

        // Race-condition guard: another concurrent run may have already rendered
        if (buttonRenderedRef.current) {
          setIsLoading(false);
          return;
        }

        if (!window.paypal?.Buttons) throw new Error('PayPal not available');

        // Mark as rendered BEFORE calling render() to block any concurrent runs
        buttonRenderedRef.current = true;

        const buttons = window.paypal.Buttons({
          createOrder: async (_data: unknown, actions: any) => {
            return await actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                { amount: { currency_code: currency, value: amount.toFixed(2) } },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            const details = await actions.order.capture(data.orderID);
            if (details.status === 'COMPLETED') onSuccess?.(details.id);
            else onError?.(`Payment status: ${details.status}`);
          },
          onError: (err: any) => {
            onError?.(err?.message || 'Payment failed');
          },
        });

        await buttons.render(containerRef.current);

        if (isMountedRef.current) setIsLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load PayPal';
        buttonRenderedRef.current = false; // allow retry on error
        onError?.(message);
        if (isMountedRef.current) setIsLoading(false);
      }
    };

    initPayPal();

    return () => {
      isMountedRef.current = false;
      // Do NOT reset buttonRenderedRef here - prevents StrictMode double-render
    };
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading PayPal...</span>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className={`w-full transition-all duration-300 ${
          isLoading ? 'h-[120px] opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />
    </div>
  );
}
