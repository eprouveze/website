# VoiceDNA Product Packaging

**Purpose**: Define exact deliverables for each product tier
**Platform**: LemonSqueezy (digital download)

---

## Tier Structure

| Tier | Price | Target | Key Differentiator |
|------|-------|--------|-------------------|
| Starter | $49 | Single-language users | 1 language, 3 contexts |
| Pro | $99 | Main offer | Unlimited languages + video |
| Executive | $249 | Leaders & executives | + Priority support, 1yr subscription |

---

## Tier 1: Starter ($49)

### Delivery: Single ZIP file

```
VoiceDNA-Starter/
│
├── 00-START-HERE.pdf (2 pages)
│   └── Quick overview, what's included, how to proceed
│
├── 01-Golden-Corpus-Generator/
│   ├── Context-Discovery-Questionnaire.pdf
│   ├── Sample-Collection-Checklist.pdf
│   └── Corpus-Template.md
│
├── 02-Master-Extraction-Prompt/
│   └── Forensic-Extraction-Prompt.txt
│
├── 03-Universal-Meta-Prompt/
│   └── Meta-Prompt.txt
│
├── 04-Deployment-Guides/
│   └── Quick-Start-Guide.pdf (condensed, all platforms)
│
└── README.txt
    └── Support: [email], Response time: best effort
```

**Total files**: ~8
**Estimated size**: ~2 MB

---

## Tier 2: Pro ($99) ← MAIN OFFER

### Delivery: Single ZIP file

```
VoiceDNA-Pro/
│
├── 00-START-HERE.pdf (4 pages)
│   ├── Welcome & overview
│   ├── What's included (visual map)
│   ├── Recommended workflow
│   └── How to get help
│
├── 01-Golden-Corpus-Generator/
│   ├── Context-Discovery-Questionnaire.pdf
│   ├── Sample-Collection-Guide.pdf (detailed)
│   ├── Corpus-Organization-Template.md
│   ├── Quality-Checklist.pdf
│   └── Where-To-Find-Samples.pdf
│
├── 02-Master-Extraction-Prompt/
│   ├── Forensic-Extraction-Prompt.txt
│   └── Extraction-Guide.pdf (how to use, what to expect)
│
├── 03-Universal-Meta-Prompt/
│   ├── Meta-Prompt.txt
│   └── Output-Guide.pdf (understanding your results)
│
├── 04-Deployment-Guides/
│   ├── Platform-Selection-Guide.pdf (which to choose)
│   ├── ChatGPT-Custom-GPT-Setup.pdf (step-by-step with screenshots)
│   ├── Claude-Project-Setup.pdf
│   ├── Gemini-Gem-Setup.pdf
│   ├── Manual-API-Usage.pdf
│   └── Testing-Checklist.pdf
│
├── 05-Examples/
│   ├── Sample-Golden-Corpus-Anonymized.md
│   ├── Sample-Voice-DNA-Output.md
│   └── Sample-Runtime-Block.txt
│
├── 06-Bonus/
│   ├── Iteration-Workflow.pdf
│   ├── Troubleshooting-Guide.pdf
│   └── Voice-DNA-Maintenance.pdf
│
├── VIDEO-WALKTHROUGH.txt
│   └── Link to unlisted YouTube/Loom (30 min)
│
└── README.txt
    └── Support: [email], Response time: 48 hours
```

**Total files**: ~20
**Estimated size**: ~5 MB

### Video Walkthrough Outline (30 min)

| Section | Duration | Content |
|---------|----------|---------|
| Intro | 2 min | What you'll learn, expected outcome |
| Stage 1 | 8 min | Collecting samples, using the questionnaire |
| Stage 2 | 6 min | Running the extraction prompt, reviewing output |
| Stage 3 | 6 min | Using the meta-prompt, understanding outputs |
| Stage 4 | 6 min | Deploying to ChatGPT (demo) |
| Testing | 2 min | How to validate your Digital Twin |

---

## Tier 3: Executive ($249)

### Delivery: Same as Pro + Personal Service

```
VoiceDNA-Executive/
│
├── [Everything from Pro tier]
│
├── 07-Executive-Bonus/
│   ├── Executive-Quick-Start.pdf (condensed 1-page workflow)
│   └── Review-Submission-Guide.pdf
│
└── README.txt
    └── Support: [email], Response time: 24 hours
    └── Includes: 1 async review of your Voice DNA output
```

### Service Component

**What's included:**
1. Customer completes Stages 1-3
2. Customer emails their Voice DNA output (Master Guide + Runtime Block)
3. We review within 48 hours
4. We send back:
   - Assessment (does it capture their voice?)
   - Specific recommendations for improvement
   - Suggested edits to Runtime Block
5. Customer implements feedback

**Time investment (us)**: ~45 min per customer

---

## File Production Checklist

### Already Created (in /projects/)
- [x] Stage 1: `digital-twin-stage1-corpus-generator.md`
- [x] Stage 2: Master Extraction Prompt (user has v4.0)
- [x] Stage 3: Universal Meta-Prompt (user has v1.0)
- [x] Stage 4: `digital-twin-stage4-deployment.md`

### Need to Create
- [ ] 00-START-HERE.pdf (convert from markdown + design)
- [ ] Platform-specific guides with screenshots
- [ ] Sample anonymized corpus (from user's example)
- [ ] Sample Voice DNA output (anonymized)
- [ ] Video walkthrough (record)
- [ ] PDF formatting/design for all docs

### From User's Existing Materials
- [ ] Master Extraction Prompt v4.0 → clean up for product
- [ ] Universal Meta-Prompt v1.0 → clean up for product
- [ ] Golden Corpus example → anonymize further
- [ ] Runtime Block example → anonymize

---

## Payment & Delivery Setup (Stripe Japan)

### Why Stripe Direct (from Japan)

| Factor | Stripe Direct | LemonSqueezy | Gumroad |
|--------|---------------|--------------|---------|
| Japan bank payout | ✅ Native | ⚠️ PayPal only | ⚠️ Via Stripe Connect |
| Fees (domestic) | 3.6% + ¥40 | ~8-9% total | ~13% total |
| Fees (international) | 3.9% + ¥40 | ~8-9% total | ~13% total |
| Tax handling | You handle | They handle | They handle |
| Setup complexity | Medium | Easy | Easy |

**Note on tax**: Japanese Consumption Tax (JCT) does NOT apply to digital content sold to overseas customers. Most of your customers will likely be non-Japan residents.

---

### Architecture (Vercel + Supabase + Stripe)

```
┌──────────────────────────────────────────────────────────────────┐
│                         VERCEL                                    │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐   │
│  │ Landing Page│───▶│   Stripe    │───▶│   Thank-You Page    │   │
│  │  (Next.js)  │    │  Checkout   │    │ (verifies purchase) │   │
│  └─────────────┘    └─────────────┘    └──────────┬──────────┘   │
│                                                    │              │
│                     ┌─────────────────────────────▼──────────┐   │
│                     │  API Route: /api/download              │   │
│                     │  (validates token, serves file)        │   │
│                     └─────────────────────────────┬──────────┘   │
└───────────────────────────────────────────────────┼──────────────┘
                                                    │
┌───────────────────────────────────────────────────┼──────────────┐
│                       SUPABASE                    │              │
│  ┌─────────────────┐    ┌─────────────────────────▼──────────┐   │
│  │    purchases    │    │         Storage                    │   │
│  │ (email, token,  │    │   /voicedna-starter.zip            │   │
│  │  product, date) │    │   /voicedna-pro.zip           │   │
│  └────────▲────────┘    │   /voicedna-executive.zip          │   │
│           │             └────────────────────────────────────┘   │
│           │                                                      │
│  ┌────────┴────────┐                                             │
│  │  Edge Function  │◀──── Stripe Webhook (checkout.completed)   │
│  │ (record purchase│                                             │
│  │  generate token)│                                             │
│  └─────────────────┘                                             │
└──────────────────────────────────────────────────────────────────┘
```

**Flow:**
1. Customer visits landing page → clicks Buy
2. Stripe Checkout handles payment
3. Stripe webhook triggers Supabase Edge Function
4. Edge Function records purchase + generates secure token
5. Customer redirected to thank-you page with `?token=xxx`
6. Thank-you page validates token → shows download button
7. Download button calls `/api/download?token=xxx`
8. API validates token → serves file from Supabase Storage

---

### Step 1: Stripe Japan Account

1. Go to [stripe.com/jp](https://stripe.com/jp)
2. Create account (individual or business)
3. Complete identity verification (本人確認)
4. Add Japanese bank account for payouts
5. Enable Checkout in Dashboard → Settings → Checkout

**Required documents** (individual):
- 運転免許証 or マイナンバーカード or パスポート
- Bank account details

---

### Step 2: Create Products in Stripe

In Stripe Dashboard → Products:

| Product | Price | Price ID (example) |
|---------|-------|-------------------|
| VoiceDNA Starter | ¥7,500 (~$49) | price_starter_xxx |
| VoiceDNA Pro | ¥15,000 (~$99) | price_pro_xxx |
| VoiceDNA Executive | ¥38,000 (~$249) | price_executive_xxx |

**Pricing strategy**: Price in JPY for Japanese customers, but also enable USD for international.

---

### Step 3: Tech Stack (Vercel + Supabase)

| Component | Service | Cost |
|-----------|---------|------|
| Landing page + Thank-you | Vercel (Next.js) | Free tier |
| Database (purchases) | Supabase | Free tier |
| File storage | Supabase Storage | Free tier (1GB) |
| Webhook handler | Supabase Edge Functions | Free tier |
| Payments | Stripe Japan | 3.6-3.9% + ¥40 |

**Total monthly cost**: ¥0 (until you exceed free tiers)

---

### Step 4: Supabase Setup

#### 4.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your `SUPABASE_URL` and `SUPABASE_ANON_KEY`

#### 4.2 Create Purchases Table

```sql
create table purchases (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  product text not null,
  stripe_session_id text unique not null,
  download_token text unique not null,
  download_count int default 0,
  max_downloads int default 5,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone default now() + interval '7 days'
);

-- Index for token lookups
create index idx_purchases_token on purchases(download_token);
```

#### 4.3 Upload Product Files

In Supabase Dashboard → Storage:
1. Create bucket: `products` (private)
2. Upload:
   - `voicedna-starter.zip`
   - `voicedna-pro.zip`
   - `voicedna-executive.zip`

#### 4.4 Create Edge Function (Stripe Webhook)

```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@14"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Generate secure download token
    const token = crypto.randomUUID()

    // Get product from metadata
    const product = session.metadata?.product || 'complete'

    await supabase.from('purchases').insert({
      email: session.customer_email,
      product: product,
      stripe_session_id: session.id,
      download_token: token,
    })
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

---

### Step 5: Next.js App Structure

```
voicedna-site/
├── app/
│   ├── page.tsx              # Landing page
│   ├── success/
│   │   └── page.tsx          # Thank-you page
│   └── api/
│       └── download/
│           └── route.ts      # Secure file download
├── components/
│   └── PricingCard.tsx
└── lib/
    └── supabase.ts
```

#### Landing Page (app/page.tsx)

Uses the sales page copy with Stripe Payment Links as buttons.

#### Thank-You Page (app/success/page.tsx)

```typescript
// app/success/page.tsx
import { createClient } from '@/lib/supabase'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const supabase = createClient()

  // Look up purchase by Stripe session
  const { data: purchase } = await supabase
    .from('purchases')
    .select('*')
    .eq('stripe_session_id', searchParams.session_id)
    .single()

  if (!purchase) {
    return <div>Purchase not found. Please contact support.</div>
  }

  return (
    <div>
      <h1>✅ Payment Confirmed!</h1>
      <p>Thank you for purchasing VoiceDNA {purchase.product}.</p>

      <a href={`/api/download?token=${purchase.download_token}`}>
        Download Your Files
      </a>

      <p>Downloads remaining: {purchase.max_downloads - purchase.download_count}</p>
    </div>
  )
}
```

#### Download API (app/api/download/route.ts)

```typescript
// app/api/download/route.ts
import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const supabase = createClient()

  // Validate token
  const { data: purchase } = await supabase
    .from('purchases')
    .select('*')
    .eq('download_token', token)
    .gte('expires_at', new Date().toISOString())
    .lt('download_count', supabase.raw('max_downloads'))
    .single()

  if (!purchase) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 403 }
    )
  }

  // Increment download count
  await supabase
    .from('purchases')
    .update({ download_count: purchase.download_count + 1 })
    .eq('id', purchase.id)

  // Get file from storage
  const fileName = `voicedna-${purchase.product}.zip`
  const { data: file } = await supabase.storage
    .from('products')
    .download(fileName)

  // Return file
  return new NextResponse(file, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  })
}
```

---

### Step 6: Stripe Configuration

#### Checkout Session (with metadata)

When creating Stripe Payment Links or Checkout Sessions, include product metadata:

```
Metadata:
  product: "starter" | "complete" | "executive"
```

#### Success URL

```
https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}
```

#### Webhook Endpoint

In Stripe Dashboard → Developers → Webhooks:
1. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
2. Select event: `checkout.session.completed`
3. Note the webhook signing secret

---

### Step 7: Environment Variables

#### Vercel (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_COMPLETE=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_EXECUTIVE=price_xxx
```

#### Supabase Edge Functions
```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
```

---

### Step 8: Checkout Settings

In Stripe Dashboard → Payment Links (or Checkout Sessions):

- **Success URL**: `https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}`
- **Cancel URL**: `https://yourdomain.com`
- **Collect email**: Yes (required)
- **Collect billing address**: Optional
- **Allow promotion codes**: Yes
- **Metadata**: `product: starter|complete|executive`

---

### Products to Create

| Product | Price (JPY) | Price (USD) | Type |
|---------|-------------|-------------|------|
| VoiceDNA Starter | ¥7,500 | $49 | One-time |
| VoiceDNA Pro | ¥15,000 | $99 | One-time |
| VoiceDNA Executive | ¥38,000 | $249 | One-time + priority support |

### Refund Policy

Configure in Stripe:
- **Refund window**: 14 days
- **Process**: Customer emails you, you issue refund in Dashboard
- **Note**: Add refund policy to landing page and thank-you page

### Email Follow-up (Manual for MVP)

Since Stripe doesn't have built-in email automation, handle manually or use simple tools:

**Tools for automation (optional)**:
- Buttondown (free tier) — for follow-up sequences
- Resend — transactional emails via API
- Zapier — connect Stripe to email

**MVP approach (manual)**:

**Post-purchase (Starter/Pro):**
1. Stripe sends automatic receipt
2. Thank-you page provides download
3. Day 2-3: Manual check-in email (optional)

**Post-purchase (Executive):**
1. Thank-you page provides download + submission instructions
2. Priority support activated for 30 days

---

## Pricing Psychology

### Anchor Display

```
┌─────────────────────────────────────────────────────┐
│  STARTER             PRO ⭐          EXECUTIVE     │
│    $49               $99               $249        │
│                   Most Popular                      │
│  ○ 1 language     ○ Unlimited langs  ○ Everything  │
│  ○ 3 contexts     ○ Video            ○ + 1yr sub   │
│                   ○ Examples         ○ + Priority  │
│                   ○ Edit sub $10/yr                │
│                                                     │
│  [Get Starter]     [Get Pro]      [Get Executive]  │
└─────────────────────────────────────────────────────┘
```

### Launch Pricing

| Tier | Regular | Launch (first week) | Savings |
|------|---------|---------------------|---------|
| Starter | $49 | $39 | $10 |
| Pro | $149 | $99 | $50 |
| Executive | $299 | $249 | $50 |

---

## Quality Checklist Before Launch

### Content
- [ ] All prompts tested and working
- [ ] All guides reviewed for clarity
- [ ] Screenshots current (platform UIs change)
- [ ] Links working (video, support email)
- [ ] Anonymization complete (no personal/client info)

### Packaging
- [ ] ZIP files open correctly
- [ ] PDFs render properly
- [ ] File names clear and consistent
- [ ] README in every folder
- [ ] Total size reasonable (<10MB per tier)

### Platform (Vercel + Supabase + Stripe Japan)

**Stripe:**
- [ ] Stripe Japan account created and verified
- [ ] Japanese bank account connected
- [ ] Products created with correct pricing (JPY + USD)
- [ ] Payment Links generated with metadata
- [ ] Webhook endpoint configured
- [ ] Test mode purchases working

**Supabase:**
- [ ] Project created
- [ ] `purchases` table created
- [ ] Storage bucket created (private)
- [ ] Product ZIP files uploaded
- [ ] Edge Function deployed
- [ ] Edge Function environment variables set

**Vercel:**
- [ ] Next.js app deployed
- [ ] Environment variables configured
- [ ] Custom domain connected (optional)
- [ ] Success page working
- [ ] Download API working

**End-to-End Test:**
- [ ] Test purchase in Stripe test mode
- [ ] Webhook fires correctly
- [ ] Purchase recorded in Supabase
- [ ] Thank-you page shows download
- [ ] Download works (token validated)
- [ ] Download count increments

### Legal
- [ ] Terms of use included
- [ ] Refund policy clear
- [ ] No trademarked content issues
- [ ] AI platform terms compliance noted

---

*Packaging v1.0 — Ready for production*
