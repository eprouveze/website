# VoiceDNA Product Packaging

**Purpose**: Define exact deliverables for each product tier
**Platform**: LemonSqueezy (digital download)

---

## Tier Structure

| Tier | Price | Target | Key Differentiator |
|------|-------|--------|-------------------|
| Starter | $49 | DIY experimenters | Prompts only |
| Complete | $99 | Main offer | Full system + video |
| Executive | $249 | Time-constrained | + Personal review |
| Done-For-You | $499 | Hands-off | Full service |

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

## Tier 2: Complete ($99) ← MAIN OFFER

### Delivery: Single ZIP file

```
VoiceDNA-Complete/
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

### Delivery: Same as Complete + Personal Service

```
VoiceDNA-Executive/
│
├── [Everything from Complete tier]
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

## Tier 4: Done-For-You ($499)

### Delivery: Custom + Complete Package

```
VoiceDNA-DoneForYou/
│
├── [Everything from Complete tier - for reference]
│
├── CUSTOM/
│   ├── [Customer-Name]-Golden-Corpus.md
│   ├── [Customer-Name]-Master-Voice-Guide.pdf
│   ├── [Customer-Name]-Runtime-Block.txt
│   └── [Customer-Name]-Deployment-Notes.pdf
│
└── README.txt
    └── Dedicated support for 30 days
```

### Service Workflow

| Step | Action | Time |
|------|--------|------|
| 1 | Customer fills intake form | 15 min (them) |
| 2 | Voice interview (async Loom or live Zoom) | 30 min |
| 3 | Customer provides writing samples | 30 min (them) |
| 4 | We curate Golden Corpus | 1 hour (us) |
| 5 | We run extraction + generation | 1 hour (us) |
| 6 | We review and refine | 30 min (us) |
| 7 | We deploy to their platform | 15 min (us) |
| 8 | Customer tests, we refine (round 1) | 30 min (us) |
| 9 | Final refinement (round 2) | 30 min (us) |

**Total time investment (us)**: ~4 hours per customer
**Gross margin**: $499 - ~$100 (4hr × $25 opportunity cost) = ~$400 (80%)

### Intake Form Questions

1. Which languages do you use professionally?
2. What are your main communication contexts? (email, Slack, presentations, etc.)
3. Who are your typical audiences? (clients, team, executives)
4. What AI platform do you prefer? (ChatGPT, Claude, Gemini)
5. What's your biggest frustration with AI writing currently?
6. Please provide 10-20 writing samples (or we'll guide you)

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

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Landing Page   │────▶│ Stripe Checkout │────▶│    Delivery     │
│  (Carrd/Framer) │     │  (hosted page)  │     │  (see options)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

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
| VoiceDNA Complete | ¥15,000 (~$99) | price_complete_xxx |
| VoiceDNA Executive | ¥38,000 (~$249) | price_executive_xxx |
| VoiceDNA Done-For-You | ¥76,000 (~$499) | price_dfy_xxx |

**Pricing strategy**: Price in JPY for Japanese customers, but also enable USD for international.

---

### Step 3: Landing Page Options

| Option | Cost | Complexity | Best For |
|--------|------|------------|----------|
| **Carrd** | $19/year | Very easy | MVP, fast launch |
| **Framer** | $5-15/mo | Easy | Better design |
| **Super.so** | $12/mo | Easy | Notion-based |
| **Own site** | Hosting cost | Medium | Full control |

**Carrd recommended for MVP**:
- Create payment links in Stripe
- Embed buttons on Carrd page
- Simple, fast, looks professional

---

### Step 4: Delivery Options

Since Stripe doesn't deliver files, you need a delivery mechanism:

#### Option A: Manual Email (Simplest for MVP)
1. Stripe webhook triggers on successful payment
2. You receive email notification
3. You manually send download link
4. **Pros**: Zero setup, works immediately
5. **Cons**: Not instant, requires your attention

#### Option B: Hosted Files + Thank You Page
1. Host ZIP files on Cloudflare R2, Vercel, or Google Drive (unlisted)
2. Stripe Checkout redirects to thank-you page with download links
3. Links are obfuscated but not fully protected
4. **Pros**: Instant delivery, simple
5. **Cons**: Links could be shared

#### Option C: SendOwl ($9/mo)
1. Integrates directly with Stripe
2. Handles secure file delivery, download limits
3. Sends automatic delivery emails
4. **Pros**: Professional, secure, automatic
5. **Cons**: Monthly cost

#### Option D: Gumroad for Delivery Only
1. Create $0 products on Gumroad
2. After Stripe payment, send Gumroad unlock link
3. **Pros**: Proven delivery system
4. **Cons**: Extra step, feels hacky

**Recommendation**: Start with Option B (hosted files + thank-you page) for MVP. Upgrade to SendOwl if volume justifies.

---

### Step 5: Thank-You Page Setup

Create a simple thank-you page with:

```
✅ Payment Confirmed!

Thank you for purchasing VoiceDNA [Tier].

📥 Download Your Files:
[Download VoiceDNA-Complete.zip] (button)

📺 Video Walkthrough:
[Watch Now] (link to unlisted YouTube/Loom)

📧 Questions?
Email: [your-email] — I respond within 48 hours.

🎁 What's Next:
1. Download and unzip the files
2. Start with 00-START-HERE.pdf
3. Follow the 4-stage process
4. Reply to your confirmation email with any questions
```

---

### Step 6: Stripe Checkout Links

Create Payment Links in Stripe Dashboard → Payment Links:

| Tier | Link Format |
|------|-------------|
| Starter | `https://buy.stripe.com/xxx_starter` |
| Complete | `https://buy.stripe.com/xxx_complete` |
| Executive | `https://buy.stripe.com/xxx_executive` |
| Done-For-You | `https://buy.stripe.com/xxx_dfy` |

Embed these as buttons on your Carrd/landing page.

---

### Checkout Settings

- **Success URL**: Your thank-you page with download links
- **Cancel URL**: Back to landing page
- **Collect email**: Yes (required for delivery)
- **Collect billing address**: Optional (helps with tax records)
- **Allow promotion codes**: Yes (for launch discounts)

---

### Products to Create

| Product | Price (JPY) | Price (USD) | Type |
|---------|-------------|-------------|------|
| VoiceDNA Starter | ¥7,500 | $49 | One-time |
| VoiceDNA Complete | ¥15,000 | $99 | One-time |
| VoiceDNA Executive | ¥38,000 | $249 | One-time + manual service |
| VoiceDNA Done-For-You | ¥76,000 | $499 | Manual service |

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

**Post-purchase (Starter/Complete):**
1. Stripe sends automatic receipt
2. Thank-you page provides download
3. Day 2-3: Manual check-in email (optional)

**Post-purchase (Executive):**
1. Thank-you page provides download + submission instructions
2. You email when review is ready

**Post-purchase (Done-For-You):**
1. You email intake form within 24 hours
2. Manual coordination from there

---

## Pricing Psychology

### Anchor Display

```
┌─────────────────────────────────────────────────────┐
│  STARTER          COMPLETE ⭐        EXECUTIVE     │
│    $49               $99               $249        │
│                   Most Popular                      │
│  ○ Prompts only   ○ Full system      ○ Everything  │
│                   ○ Video            ○ + Review    │
│                   ○ Examples         ○ + Priority  │
│                   ○ Support                        │
│                                                     │
│  [Get Starter]   [Get Complete]    [Get Executive] │
└─────────────────────────────────────────────────────┘

        Need hands-off? → Done-For-You $499
```

### Launch Pricing

| Tier | Regular | Launch (first week) | Savings |
|------|---------|---------------------|---------|
| Starter | $49 | $39 | $10 |
| Complete | $149 | $99 | $50 |
| Executive | $299 | $249 | $50 |
| Done-For-You | $599 | $499 | $100 |

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

### Platform (Stripe Japan)
- [ ] Stripe account created and verified
- [ ] Japanese bank account connected
- [ ] Products created with correct pricing (JPY + USD)
- [ ] Payment Links generated
- [ ] Checkout success/cancel URLs configured
- [ ] Thank-you page with download links ready
- [ ] Files hosted (Cloudflare R2, Vercel, or Drive)
- [ ] Test purchase completed
- [ ] Landing page live (Carrd/Framer)

### Legal
- [ ] Terms of use included
- [ ] Refund policy clear
- [ ] No trademarked content issues
- [ ] AI platform terms compliance noted

---

*Packaging v1.0 — Ready for production*
