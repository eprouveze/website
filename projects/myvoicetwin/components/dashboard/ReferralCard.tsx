'use client';

import { useState, useEffect } from 'react';
import { Gift, Copy, Check, Users, DollarSign, Share2 } from 'lucide-react';
import Link from 'next/link';

interface ReferralData {
  has_code: boolean;
  message?: string;
  referral_code?: {
    code: string;
    discount_percent: number;
    commission_percent: number;
    uses: number;
    is_active: boolean;
  };
  stats?: {
    total_referrals: number;
    pending_amount_cents: number;
    approved_amount_cents: number;
    paid_out_amount_cents: number;
    total_earned_cents: number;
  };
  share_url?: string;
}

export default function ReferralCard() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const res = await fetch('/api/referral/my-code');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // User doesn't have a referral code yet (hasn't purchased)
  if (!data?.has_code) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Gift className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Share & Earn $20</h3>
            <p className="mt-1 text-sm text-gray-600">
              After your first purchase, you&apos;ll get a referral code. Share it with friends
              and earn 20% commission on every sale!
            </p>
            <Link
              href="/#pricing"
              className="mt-3 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              View pricing to get started
              <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const code = data.referral_code!;
  const stats = data.stats!;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-white" />
            <h3 className="font-semibold text-white">Your Referral Program</h3>
          </div>
          <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
            {code.commission_percent}% commission
          </span>
        </div>
      </div>

      {/* Referral Link */}
      <div className="p-6 border-b border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Referral Link
        </label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
            <span className="text-sm text-gray-600 truncate">{data.share_url}</span>
          </div>
          <button
            onClick={() => copyToClipboard(data.share_url!)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span className="text-sm">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="text-sm">Copy</span>
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Code: <span className="font-mono font-semibold text-purple-600">{code.code}</span>
          {' '}• Friends get {code.discount_percent}% off
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Users className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total_referrals}</p>
          <p className="text-xs text-gray-500">Referrals</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <DollarSign className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            ${(stats.total_earned_cents / 100).toFixed(0)}
          </p>
          <p className="text-xs text-gray-500">Total Earned</p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
            <Share2 className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{code.uses}</p>
          <p className="text-xs text-gray-500">Code Uses</p>
        </div>
      </div>

      {/* Pending Earnings */}
      {stats.pending_amount_cents > 0 && (
        <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
          <p className="text-sm text-amber-800">
            <span className="font-medium">
              ${(stats.pending_amount_cents / 100).toFixed(2)}
            </span>{' '}
            pending approval
          </p>
        </div>
      )}
    </div>
  );
}
