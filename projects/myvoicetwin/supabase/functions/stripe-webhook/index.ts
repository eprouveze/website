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

// Product display names
const PRODUCT_NAMES: Record<string, string> = {
  starter: 'Starter',
  complete: 'Complete',
  executive: 'Executive',
  'done-for-you': 'Done-For-You',
}

// Send purchase confirmation email via Resend
async function sendPurchaseConfirmationEmail(
  email: string,
  product: string,
  downloadToken: string
): Promise<boolean> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured')
    return false
  }

  const siteUrl = Deno.env.get('SITE_URL') || 'https://myvoicetwin.io'
  const productName = PRODUCT_NAMES[product] || product
  const downloadUrl = `${siteUrl}/api/download?token=${downloadToken}`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'My Voice Twin <hello@myvoicetwin.io>',
        to: email,
        subject: `Your My Voice Twin ${productName} Package is Ready!`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7c3aed; margin: 0;">My Voice Twin</h1>
  </div>

  <div style="background: #10b981; color: white; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
    <h2 style="margin: 0;">Payment Confirmed!</h2>
  </div>

  <p>Thank you for your purchase! Your <strong>My Voice Twin ${productName}</strong> package is ready for download.</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${downloadUrl}"
       style="background: linear-gradient(to right, #10b981, #059669); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 18px;">
      Download Your Files
    </a>
  </div>

  <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <p style="margin: 0; color: #92400e;">
      <strong>Important:</strong> Your download link expires in 7 days. You have 5 download attempts.
    </p>
  </div>

  <h3 style="color: #1f2937;">Getting Started</h3>
  <ol style="padding-left: 20px;">
    <li>Download and unzip your package</li>
    <li>Open <strong>00-START-HERE.pdf</strong></li>
    <li>Follow the step-by-step instructions</li>
    <li>Deploy your Voice Twin to any AI platform</li>
  </ol>

  <p style="color: #6b7280; font-size: 14px;">
    Questions? Contact us at support@myvoicetwin.io - we typically respond within 48 hours.
  </p>

  <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p>&copy; ${new Date().getFullYear()} My Voice Twin. All rights reserved.</p>
  </div>
</body>
</html>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Resend API error:', error)
      return false
    }

    console.log('Purchase confirmation email sent to:', email)
    return true
  } catch (err) {
    console.error('Email send error:', err)
    return false
  }
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

      // Send purchase confirmation email
      await sendPurchaseConfirmationEmail(email, product, token)
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
