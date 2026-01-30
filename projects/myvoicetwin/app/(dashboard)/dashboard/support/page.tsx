'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient, type SupportTicket } from '@/lib/supabase';
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  X,
  Crown,
  ChevronRight,
} from 'lucide-react';

type TicketWithMessages = SupportTicket & {
  message_count?: number;
};

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    open: { color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-3 h-3" /> },
    in_progress: { color: 'bg-amber-100 text-amber-700', icon: <Loader2 className="w-3 h-3" /> },
    resolved: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
    closed: { color: 'bg-slate-100 text-slate-600', icon: <CheckCircle className="w-3 h-3" /> },
  };

  const { color, icon } = config[status] || config.open;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {status.replace('_', ' ')}
    </span>
  );
}

// Priority badge component
function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[priority] || colors.medium}`}>
      {priority}
    </span>
  );
}

// New ticket modal
function NewTicketModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { subject: string; description: string; priority: string }) => void;
  isSubmitting: boolean;
}) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ subject, description, priority });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Create Support Ticket</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            >
              <option value="low">Low - General question</option>
              <option value="medium">Medium - Need help</option>
              <option value="high">High - Something isn&apos;t working</option>
              <option value="urgent">Urgent - Critical issue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
              placeholder="Please describe your issue in detail..."
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !subject || !description}
              className="flex-1 px-4 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Create Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [tickets, setTickets] = useState<TicketWithMessages[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPrioritySupport, setHasPrioritySupport] = useState(false);
  const [supportExpiresAt, setSupportExpiresAt] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      // Fetch tickets
      const response = await fetch('/api/support/tickets');
      const data = await response.json();

      if (data.tickets) {
        setTickets(data.tickets);

        // Check for priority support from any ticket
        const ticketWithSupport = data.tickets.find(
          (t: SupportTicket) => t.support_expires_at && new Date(t.support_expires_at) > new Date()
        );
        if (ticketWithSupport) {
          setHasPrioritySupport(true);
          setSupportExpiresAt(ticketWithSupport.support_expires_at);
        }
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = async (data: { subject: string; description: string; priority: string }) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.ticket) {
        setTickets((prev) => [result.ticket, ...prev]);
        setShowNewTicket(false);

        if (result.has_priority_support) {
          setHasPrioritySupport(true);
          setSupportExpiresAt(result.support_expires_at);
        }
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const daysUntilExpiry = supportExpiresAt
    ? Math.ceil((new Date(supportExpiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading support...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Support</h1>
            <p className="text-slate-600">Get help with your Voice Twin</p>
          </div>
        </div>

        <button
          onClick={() => setShowNewTicket(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {/* Priority Support Banner */}
      {hasPrioritySupport && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Crown className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900">Priority Support Active</p>
            <p className="text-sm text-slate-600">
              {daysUntilExpiry > 0
                ? `${daysUntilExpiry} days remaining of your 30-day priority support`
                : 'Your priority support has expired'}
            </p>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Your Tickets</h2>
        </div>

        {tickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tickets yet</h3>
            <p className="text-slate-600 mb-6">
              Need help? Create a support ticket and we&apos;ll get back to you.
            </p>
            <button
              onClick={() => setShowNewTicket(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Ticket
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/dashboard/support/${ticket.id}`}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-slate-900 truncate">{ticket.subject}</h3>
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <p className="text-sm text-slate-500 truncate">{ticket.description}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Created {formatDate(ticket.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={ticket.status} />
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* No Priority Support Upsell */}
      {!hasPrioritySupport && tickets.length > 0 && (
        <div className="mt-6 bg-gradient-to-br from-brand-950 to-brand-800 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-6 h-6 text-amber-400" />
            <h3 className="font-semibold text-lg">Get Priority Support</h3>
          </div>
          <p className="text-brand-200 mb-4">
            Upgrade to Executive tier for 30 days of priority support with faster response times.
          </p>
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-600 rounded-xl font-semibold hover:bg-brand-50 transition-colors"
          >
            View Executive Tier
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* FAQ Section */}
      <div className="mt-8 bg-slate-50 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-800">How long until I get a response?</h4>
            <p className="text-sm text-slate-600 mt-1">
              {hasPrioritySupport
                ? 'Priority support tickets are typically answered within 24 hours.'
                : 'Standard tickets are typically answered within 48-72 hours.'}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-slate-800">What counts as priority support?</h4>
            <p className="text-sm text-slate-600 mt-1">
              Executive tier includes 30 days of priority support with faster response times and dedicated assistance.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-slate-800">Can I reopen a closed ticket?</h4>
            <p className="text-sm text-slate-600 mt-1">
              Yes, simply add a new reply to any resolved ticket and it will be reopened automatically.
            </p>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={showNewTicket}
        onClose={() => setShowNewTicket(false)}
        onSubmit={handleCreateTicket}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
