'use client';

import { useState } from 'react';
import Link from 'next/link';

type AffiliateStatus = 'idle' | 'loading' | 'success' | 'error';
type CheckStatus = 'idle' | 'loading' | 'found' | 'not_found' | 'error';

interface AffiliateData {
  name: string;
  email: string;
  status: string;
  applied_at: string;
  approved_at?: string;
  rejection_reason?: string;
}

interface ReferralCodeData {
  code: string;
  discount_percent: number;
  commission_percent: number;
  uses: number;
  share_url: string;
}

interface StatsData {
  total_referrals: number;
  total_earnings_cents: number;
  total_paid_out_cents: number;
  pending_payout_cents: number;
}

export default function AffiliatesPage() {
  const [activeTab, setActiveTab] = useState<'apply' | 'check'>('apply');

  // Application form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [payoutEmail, setPayoutEmail] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('paypal');
  const [applicationNote, setApplicationNote] = useState('');
  const [applyStatus, setApplyStatus] = useState<AffiliateStatus>('idle');
  const [applyMessage, setApplyMessage] = useState('');

  // Check status state
  const [checkEmail, setCheckEmail] = useState('');
  const [checkStatus, setCheckStatus] = useState<CheckStatus>('idle');
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
  const [referralCode, setReferralCode] = useState<ReferralCodeData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyStatus('loading');
    setApplyMessage('');

    try {
      const res = await fetch('/api/affiliates/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          payout_email: payoutEmail || email,
          payout_method: payoutMethod,
          application_note: applicationNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApplyStatus('error');
        setApplyMessage(data.error || 'Failed to submit application');
        return;
      }

      setApplyStatus('success');
      setApplyMessage(data.message);
      // Clear form
      setName('');
      setEmail('');
      setPayoutEmail('');
      setApplicationNote('');
    } catch {
      setApplyStatus('error');
      setApplyMessage('Network error. Please try again.');
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckStatus('loading');
    setAffiliateData(null);
    setReferralCode(null);
    setStats(null);

    try {
      const res = await fetch(`/api/affiliates/status?email=${encodeURIComponent(checkEmail)}`);
      const data = await res.json();

      if (!res.ok) {
        setCheckStatus('error');
        return;
      }

      if (!data.found) {
        setCheckStatus('not_found');
        return;
      }

      setCheckStatus('found');
      setAffiliateData(data.affiliate);
      setReferralCode(data.referral_code);
      setStats(data.stats);
    } catch {
      setCheckStatus('error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white">
              My Voice Twin
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-300 hover:text-white"
            >
              Already a customer? Log in
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Affiliate Program
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Earn <span className="text-purple-400 font-semibold">20% commission</span> on every sale you refer
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-white mb-2">20% Commission</h3>
            <p className="text-gray-300 text-sm">
              Earn $10-$50 per referral depending on the tier purchased
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <div className="text-3xl mb-3">🎁</div>
            <h3 className="text-lg font-semibold text-white mb-2">20% Off for Friends</h3>
            <p className="text-gray-300 text-sm">
              Your referrals get a discount, making it easier to convert
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Tracking</h3>
            <p className="text-gray-300 text-sm">
              Track your referrals and earnings in your dashboard
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-white/10 p-1">
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'apply'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Apply Now
            </button>
            <button
              onClick={() => setActiveTab('check')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'check'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Check Status
            </button>
          </div>
        </div>

        {/* Application Form */}
        {activeTab === 'apply' && (
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Join Our Affiliate Program
            </h2>

            {applyStatus === 'success' ? (
              <div className="rounded-lg bg-green-50 p-6 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Application Submitted!
                </h3>
                <p className="text-green-700">{applyMessage}</p>
                <button
                  onClick={() => {
                    setApplyStatus('idle');
                    setActiveTab('check');
                  }}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Check your application status →
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payout Email (PayPal)
                    </label>
                    <input
                      type="email"
                      value={payoutEmail}
                      onChange={(e) => setPayoutEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Same as email if blank"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Payout Method
                    </label>
                    <select
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How do you plan to promote My Voice Twin? (Optional)
                  </label>
                  <textarea
                    value={applicationNote}
                    onChange={(e) => setApplicationNote(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Blog, social media, email list, etc."
                  />
                </div>

                {applyStatus === 'error' && (
                  <div className="rounded-lg bg-red-50 p-4 text-red-700">
                    {applyMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={applyStatus === 'loading'}
                  className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-lg font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                >
                  {applyStatus === 'loading' ? 'Submitting...' : 'Submit Application'}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Already a customer?{' '}
                  <Link href="/dashboard" className="text-purple-600 hover:text-purple-700">
                    Log in to get your referral link
                  </Link>
                </p>
              </form>
            )}
          </div>
        )}

        {/* Check Status */}
        {activeTab === 'check' && (
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Check Application Status
            </h2>

            <form onSubmit={handleCheckStatus} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="email"
                  value={checkEmail}
                  onChange={(e) => setCheckEmail(e.target.value)}
                  required
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  disabled={checkStatus === 'loading'}
                  className="rounded-lg bg-purple-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-600 disabled:opacity-50"
                >
                  {checkStatus === 'loading' ? 'Checking...' : 'Check'}
                </button>
              </div>
            </form>

            {checkStatus === 'not_found' && (
              <div className="rounded-lg bg-yellow-50 p-6 text-center">
                <p className="text-yellow-800">
                  No application found with this email.{' '}
                  <button
                    onClick={() => setActiveTab('apply')}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Apply now →
                  </button>
                </p>
              </div>
            )}

            {checkStatus === 'error' && (
              <div className="rounded-lg bg-red-50 p-6 text-center">
                <p className="text-red-700">
                  Something went wrong. Please try again.
                </p>
              </div>
            )}

            {checkStatus === 'found' && affiliateData && (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div>
                    <p className="text-sm text-gray-500">Application Status</p>
                    <p className="text-lg font-semibold text-gray-900">{affiliateData.name}</p>
                  </div>
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      affiliateData.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : affiliateData.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : affiliateData.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {affiliateData.status.charAt(0).toUpperCase() + affiliateData.status.slice(1)}
                  </span>
                </div>

                {/* Pending Message */}
                {affiliateData.status === 'pending' && (
                  <div className="rounded-lg bg-yellow-50 p-6">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Your application is under review
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      We typically review applications within 48 hours. You&apos;ll receive an email
                      once your application has been processed.
                    </p>
                  </div>
                )}

                {/* Rejected Message */}
                {affiliateData.status === 'rejected' && (
                  <div className="rounded-lg bg-red-50 p-6">
                    <h3 className="font-semibold text-red-800 mb-2">
                      Application Not Approved
                    </h3>
                    {affiliateData.rejection_reason && (
                      <p className="text-red-700 text-sm">
                        Reason: {affiliateData.rejection_reason}
                      </p>
                    )}
                  </div>
                )}

                {/* Approved - Show Stats & Code */}
                {affiliateData.status === 'approved' && referralCode && (
                  <>
                    {/* Referral Code */}
                    <div className="rounded-lg bg-purple-50 p-6">
                      <h3 className="font-semibold text-purple-800 mb-4">
                        Your Referral Link
                      </h3>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={referralCode.share_url}
                          className="flex-1 rounded-lg border border-purple-200 bg-white px-4 py-3 text-sm"
                        />
                        <button
                          onClick={() => copyToClipboard(referralCode.share_url)}
                          className="rounded-lg bg-purple-500 px-4 py-3 text-white hover:bg-purple-600"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-purple-600">
                        Code: <span className="font-mono font-bold">{referralCode.code}</span> |
                        {' '}{referralCode.discount_percent}% off for referrals |
                        {' '}{referralCode.commission_percent}% commission for you
                      </p>
                    </div>

                    {/* Stats */}
                    {stats && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {stats.total_referrals}
                          </p>
                          <p className="text-sm text-gray-500">Total Referrals</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                          <p className="text-2xl font-bold text-green-600">
                            ${(stats.total_earnings_cents / 100).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">Total Earned</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            ${(stats.pending_payout_cents / 100).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">Pending Payout</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                          <p className="text-2xl font-bold text-gray-600">
                            ${(stats.total_paid_out_cents / 100).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">Paid Out</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* FAQ */}
        <div className="mt-12 rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-white mb-2">
                How much can I earn?
              </h3>
              <p className="text-gray-300 text-sm">
                You earn 20% commission on every sale. That&apos;s $10 for Starter ($49),
                $20 for Pro ($99), and $50 for Executive ($249).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">
                When do I get paid?
              </h3>
              <p className="text-gray-300 text-sm">
                Commissions are paid out monthly via PayPal or your preferred method,
                with a $50 minimum threshold.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">
                I&apos;m already a customer. Can I be an affiliate?
              </h3>
              <p className="text-gray-300 text-sm">
                Yes! If you&apos;ve purchased, you already have a referral code in your dashboard.
                No need to apply separately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
