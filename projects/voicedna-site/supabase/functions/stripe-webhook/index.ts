// Supabase Edge Function: Handle Stripe Webhooks
// Deploy with: supabase functions deploy stripe-webhook --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@14?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

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

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Create Supabase client with service role key
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )

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
