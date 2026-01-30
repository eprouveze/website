'use client';

import { useState, useEffect, useMemo, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient, type SupportTicket, type TicketMessage } from '@/lib/supabase';
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  CheckCircle,
  Loader2,
  Send,
  User,
  HeadphonesIcon,
  AlertCircle,
} from 'lucide-react';

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    open: { color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-3 h-3" />, label: 'Open' },
    in_progress: { color: 'bg-amber-100 text-amber-700', icon: <Loader2 className="w-3 h-3" />, label: 'In Progress' },
    resolved: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" />, label: 'Resolved' },
    closed: { color: 'bg-slate-100 text-slate-600', icon: <CheckCircle className="w-3 h-3" />, label: 'Closed' },
  };

  const { color, icon, label } = config[status] || config.open;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
}

// Message bubble component
function MessageBubble({ message, isUser }: { message: TicketMessage; isUser: boolean }) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-brand-100' : 'bg-slate-100'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-brand-600" />
        ) : (
          <HeadphonesIcon className="w-4 h-4 text-slate-600" />
        )}
      </div>

      <div className={`max-w-[70%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-brand-600 text-white rounded-br-md'
              : 'bg-slate-100 text-slate-900 rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        </div>
        <p className={`text-xs text-slate-400 mt-1 ${isUser ? 'text-right' : ''}`}>
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchTicket = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUserId(session.user.id);

      const response = await fetch(`/api/support/tickets/${id}`);
      const data = await response.json();

      if (data.ticket) {
        setTicket(data.ticket);
        setMessages(data.messages || []);
      } else {
        router.push('/dashboard/support');
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      router.push('/dashboard/support');
    } finally {
      setLoading(false);
    }
  }, [supabase, router, id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    try {
      const response = await fetch(`/api/support/tickets/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() }),
      });

      const data = await response.json();

      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage('');

        // Update ticket status if it was resolved
        if (ticket?.status === 'resolved') {
          setTicket((prev) => (prev ? { ...prev, status: 'open' } : null));
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseTicket = async () => {
    try {
      const response = await fetch(`/api/support/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed' }),
      });

      const data = await response.json();

      if (data.ticket) {
        setTicket(data.ticket);
      }
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const isClosed = ticket.status === 'closed';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/dashboard/support"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Support
        </Link>
      </div>

      {/* Ticket Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{ticket.subject}</h1>
                  <p className="text-sm text-slate-500">Created {formatDate(ticket.created_at)}</p>
                </div>
              </div>
            </div>
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        {/* Original description */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <p className="text-sm text-slate-600 font-medium mb-1">Original Request:</p>
          <p className="text-slate-800 whitespace-pre-wrap">{ticket.description}</p>
        </div>

        {/* Priority support indicator */}
        {ticket.support_expires_at && new Date(ticket.support_expires_at) > new Date() && (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-800">
              Priority support - Faster response times
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Conversation</h2>
        </div>

        <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500">No replies yet. We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isUser={message.sender_type === 'user'}
              />
            ))
          )}
        </div>

        {/* Reply form */}
        {!isClosed ? (
          <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send
              </button>
            </div>
          </form>
        ) : (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 text-center">
            <p className="text-sm text-slate-500">This ticket is closed. Create a new ticket if you need further assistance.</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isClosed && ticket.status !== 'resolved' && (
        <div className="flex justify-end">
          <button
            onClick={handleCloseTicket}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Close this ticket
          </button>
        </div>
      )}
    </div>
  );
}
