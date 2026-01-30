'use client';

import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface PricingCardProps {
  tier: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  bestFor: string;
  ctaText: string;
  priceId: string;
  popular?: boolean;
}

export default function PricingCard({
  tier,
  price,
  originalPrice,
  description,
  features,
  notIncluded = [],
  bestFor,
  ctaText,
  priceId,
  popular = false,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      // Redirect to Stripe Checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        console.error('Checkout error:', error);
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl border-2 bg-white p-6 shadow-lg transition-all duration-300
        hover:shadow-xl
        ${popular
          ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 scale-105 z-10'
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white shadow-md">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-gray-900">{tier}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>

      {/* Price */}
      <div className="mb-6 text-center">
        <div className="flex items-baseline justify-center gap-2">
          {originalPrice && (
            <span className="text-lg text-gray-400 line-through">
              {originalPrice}
            </span>
          )}
          <span className="text-4xl font-bold text-gray-900">{price}</span>
        </div>
        {originalPrice && (
          <p className="mt-1 text-sm font-medium text-green-600">
            Launch Price - Save {calculateSavings(originalPrice, price)}
          </p>
        )}
      </div>

      {/* Best For */}
      <div className="mb-6 rounded-lg bg-gray-50 px-4 py-3 text-center">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Best for:</span> {bestFor}
        </p>
      </div>

      {/* Features */}
      <div className="mb-6 flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
          {notIncluded.map((feature, index) => (
            <li key={`not-${index}`} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <X className="h-5 w-5 text-gray-400" />
              </div>
              <span className="text-sm text-gray-400">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`
          w-full rounded-lg px-6 py-3 text-base font-semibold transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-70
          ${popular
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
            : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          ctaText
        )}
      </button>
    </div>
  );
}

// Helper function to calculate savings
function calculateSavings(original: string, current: string): string {
  const originalNum = parseFloat(original.replace(/[^0-9.]/g, ''));
  const currentNum = parseFloat(current.replace(/[^0-9.]/g, ''));
  const savings = originalNum - currentNum;

  if (original.includes('$')) {
    return `$${savings}`;
  }
  if (original.includes('¥')) {
    return `¥${savings.toLocaleString()}`;
  }
  return savings.toString();
}
