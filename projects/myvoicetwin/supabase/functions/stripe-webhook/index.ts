// Supabase Edge Function: Handle Stripe Webhooks
// Deploy with: supabase functions deploy stripe-webhook --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@14?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

// Helper function to convert Unix timestamp to ISO string
function unixToISO(timestamp: number | null): string | null {
  if (!timestamp) return null
  return new Date(timestamp * 1000).toISOString()
}

serve(async (req: Request) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('Missing stripe-signature header', { status: 400 })
    }

    const body = await req.text()

    // Verify webhook signature
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider
    )

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Generate unique download token
      const token = crypto.randomUUID()

      // Get product from metadata (default to 'complete')
      const product = session.metadata?.product || 'complete'

      // Get customer email
      const email = session.customer_email || session.customer_details?.email

      if (!email) {
        console.error('No customer email found in session:', session.id)
        return new Response('No customer email', { status: 400 })
      }

      // Check if purchase already exists (idempotency)
      const { data: existing } = await supabase
        .from('purchases')
        .select('id')
        .eq('stripe_session_id', session.id)
        .single()

      if (existing) {
        console.log('Purchase already recorded for session:', session.id)
        return new Response(JSON.stringify({ received: true, duplicate: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // Insert purchase record
      const { error } = await supabase.from('purchases').insert({
        email: email,
        product: product,
        stripe_session_id: session.id,
        download_token: token,
        download_count: 0,
        max_downloads: 5,
        // expires_at is set by database default (7 days)
      })

      if (error) {
        console.error('Failed to insert purchase:', error)
        return new Response(JSON.stringify({ error: 'Database error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      console.log('Purchase recorded:', {
        email,
        product,
        session_id: session.id,
        token,
      })

      // Optional: Send confirmation email via Supabase Edge Function or external service
      // await sendConfirmationEmail(email, product, token)
    }

    // Handle other events if needed
    if (event.type === 'checkout.session.expired') {
      console.log('Checkout session expired:', event.data.object.id)
    }

    // Handle customer.subscription.created - Insert new subscription record
    if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.user_id

      if (!userId) {
        console.error('No user_id in subscription metadata:', subscription.id)
        return new Response('Missing user_id in metadata', { status: 400 })
      }

      const { error } = await supabase.from('subscriptions').insert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        status: subscription.status,
        current_period_start: unixToISO(subscription.current_period_start),
        current_period_end: unixToISO(subscription.current_period_end),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })

      if (error) {
        console.error('Failed to insert subscription:', error)
        return new Response(JSON.stringify({ error: 'Database error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      console.log('Subscription created:', {
        user_id: userId,
        subscription_id: subscription.id,
        status: subscription.status,
      })
    }

    // Handle customer.subscription.updated - Update subscription status
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription

      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_start: unixToISO(subscription.current_period_start),
          current_period_end: unixToISO(subscription.current_period_end),
          cancel_at_period_end: subscription.cancel_at_period_end,
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) {
        console.error('Failed to update subscription:', error)
        return new Response(JSON.stringify({ error: 'Database error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      console.log('Subscription updated:', {
        subscription_id: subscription.id,
        status: subscription.status,
      })
    }

    // Handle customer.subscription.deleted - Mark subscription as canceled
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription

      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          cancel_at_period_end: false,
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) {
        console.error('Failed to mark subscription as canceled:', error)
        return new Response(JSON.stringify({ error: 'Database error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      console.log('Subscription canceled:', {
        subscription_id: subscription.id,
      })
    }

    // Handle invoice.payment_succeeded - Update subscription period dates
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice

      // Only process subscription invoices
      if (invoice.subscription) {
        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription.id

        // Fetch the latest subscription data from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: unixToISO(subscription.current_period_start),
            current_period_end: unixToISO(subscription.current_period_end),
          })
          .eq('stripe_subscription_id', subscriptionId)

        if (error) {
          console.error('Failed to update subscription after payment:', error)
          return new Response(JSON.stringify({ error: 'Database error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        console.log('Subscription payment succeeded:', {
          subscription_id: subscriptionId,
          invoice_id: invoice.id,
        })
      }
    }

    // Handle invoice.payment_failed - Mark subscription as past_due
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice

      // Only process subscription invoices
      if (invoice.subscription) {
        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription.id

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
          })
          .eq('stripe_subscription_id', subscriptionId)

        if (error) {
          console.error('Failed to mark subscription as past_due:', error)
          return new Response(JSON.stringify({ error: 'Database error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        console.log('Subscription payment failed:', {
          subscription_id: subscriptionId,
          invoice_id: invoice.id,
        })
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
