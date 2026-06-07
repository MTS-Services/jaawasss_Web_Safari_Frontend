'use client';

import { useState } from 'react';
import { PayPalButton } from '@/components/payment/paypal-button';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function TestPaymentPage() {
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReset, setIsReset] = useState(false);

  const handlePaymentSuccess = (id: string) => {
    setTransactionId(id);
    setError(null);
    setIsReset(false);
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
    setTransactionId(null);
    setIsReset(false);
  };

  const handleReset = () => {
    setTransactionId(null);
    setError(null);
    setIsReset(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">PayPal Sandbox Test</h1>
          <p className="mt-2 text-gray-600">
            Test your payment integration with PayPal Sandbox
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg bg-white shadow-lg">
          <div className="p-6">
            {/* Success Message */}
            {transactionId && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Payment Successful!
                    </h3>
                    <p className="mt-1 text-sm text-green-700">
                      Transaction ID:{' '}
                      <span className="font-mono text-xs">{transactionId}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">
                      Payment Failed
                    </h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Amount */}
            <div className="mb-6 rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-gray-600">Amount to Pay</p>
              <p className="text-3xl font-bold text-gray-900">$10.00</p>
              <p className="mt-1 text-xs text-gray-500">USD</p>
            </div>

            {/* PayPal Button */}
            <div className="mb-6">
              {isReset ? (
                <PayPalButton
                  key={Date.now()}
                  amount={10.0}
                  currency="USD"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              ) : (
                <PayPalButton
                  amount={10.0}
                  currency="USD"
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}
            </div>

            {/* Test Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Sandbox Credentials</p>
                  <p className="mt-1 text-gray-600">
                    Use PayPal sandbox account credentials to test the payment flow.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Environment</p>
                  <p className="mt-1 text-gray-600">
                    This is running in Sandbox mode. No real payments will be charged.
                  </p>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            {(transactionId || error) && (
              <button
                onClick={handleReset}
                className="mt-6 w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200"
              >
                Try Another Payment
              </button>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>This is a sandbox testing page. No real transactions will occur.</p>
        </div>
      </div>
    </div>
  );
}
