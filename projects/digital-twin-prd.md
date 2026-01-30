# My Voice Twin: PRD & Business Plan (v2.0)

**Product**: My Voice Twin
**Domain**: myvoicetwin.io
**Version**: 2.0 (SaaS Model)
**Updated**: January 2026

---

## Executive Summary

**What**: A full-service web application that creates your AI "Digital Twin" — we gather your data, analyze your voice patterns, and generate a complete instruction prompt you can deploy to ChatGPT, Claude, or Gemini.

**Key Differentiator**: We BUILD it for you. Not a DIY prompt pack — a complete service where you provide the raw material and we deliver a production-ready voice profile.

**Business Model**: Freemium + One-time purchase + Subscription upsell

---

# PART 1: PRODUCT FLOW

## 1.1 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FREE TIER (Lead Capture)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STAGE 1: CAPTURE YOUR VOICE                                                │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │ Sign Up (Email)  │───▶│  Questionnaire   │───▶│  Writing Samples │       │
│  │                  │    │  (needs, context,│    │  (paste text,    │       │
│  │                  │    │   style prefs)   │    │   upload docs)   │       │
│  └──────────────────┘    └──────────────────┘    └────────┬─────────┘       │
│                                                           │                  │
│                              ┌─────────────────────────────┘                  │
│                              ▼                                                │
│                    ┌──────────────────┐                                      │
│                    │  Audio Upload    │  ◀── PAID ADD-ON ($19-49)           │
│                    │  (transcription) │      Based on audio length           │
│                    └──────────────────┘                                      │
│                                                                              │
│  💾 DATA SAVED: We have email + questionnaire + samples for follow-up       │
│                                                                              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                              ─────────┴─────────
                              │    PAYWALL     │
                              │     $99        │
                              ─────────────────
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│                              PAID TIER ($99 one-time)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STAGE 2: WE BUILD YOUR VOICE PROFILE                                       │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │ Generate Golden  │───▶│  AI Extraction   │───▶│ Generate Master  │       │
│  │ Corpus (formatted│    │  (analyze voice  │    │ Prompt (ultra-   │       │
│  │ from your data)  │    │   patterns)      │    │ detailed instrs) │       │
│  └──────────────────┘    └──────────────────┘    └────────┬─────────┘       │
│                                                           │                  │
│  STAGE 3: TEST & REFINE                                   │                  │
│  ┌────────────────────────────────────────────────────────┘                  │
│  │                                                                           │
│  ▼                                                                           │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │   Test in UI     │───▶│   Validate or    │───▶│    Regenerate    │       │
│  │ (sample message) │    │  Add More Data   │    │   (if needed)    │       │
│  └──────────────────┘    └──────────────────┘    └────────┬─────────┘       │
│                                                           │                  │
│  STAGE 4: DEPLOY                                          │                  │
│  ┌────────────────────────────────────────────────────────┘                  │
│  │                                                                           │
│  ▼                                                                           │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │  Copy Prompt     │    │  Platform Guide  │    │  Support Docs    │       │
│  │  (one-click)     │    │  (GPT/Claude/Gem)│    │  (troubleshoot)  │       │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘       │
│                                                                              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                              ─────────┴─────────
                              │  SUBSCRIPTION  │
                              │   $29/year     │
                              ─────────────────
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│                              ANNUAL SUBSCRIPTION ($29/year)                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ONGOING ACCESS:                                                             │
│  • Edit and update your voice profile anytime                                │
│  • Add new samples and contexts                                              │
│  • Regenerate with new data                                                  │
│  • Access to new features and improvements                                   │
│  • Priority support                                                          │
│                                                                              │
│  WITHOUT SUBSCRIPTION:                                                       │
│  • Voice profile remains usable (exported prompt)                            │
│  • No edits or updates possible                                              │
│  • No regeneration                                                           │
│  • Basic email support only                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1.2 What We Actually Deliver

### The Customer Provides:
- Answers to questionnaire (needs, context, style preferences)
- Writing samples (5+ recommended, paste or upload)
- Optional: Audio files for transcription (paid add-on)

### We Build For Them:
1. **Formatted Golden Corpus** — Their samples organized and tagged
2. **Voice DNA Analysis** — AI-extracted patterns, rhythm, tone markers
3. **Master Prompt** — Ultra-detailed instruction prompt (~5,000 tokens) ready to paste into any AI platform
4. **Tested & Validated** — They test it in our UI before deploying

### Key Message for Sales Page:
> "You bring your words. We build your twin."
>
> Not another prompt pack. Not a DIY course. We analyze your actual writing and generate a production-ready AI voice profile — complete with testing and refinement.

---

## 1.3 Feature Details

### Stage 1: Capture Your Voice (FREE)

| Feature | Description | Purpose |
|---------|-------------|---------|
| Questionnaire | Multi-step form collecting context, style, goals | Understand their needs |
| Sample Collection | Paste text or upload documents | Raw material for analysis |
| Sample Guidance | Tips on what makes good samples | Ensure quality input |
| Progress Tracking | Visual progress indicator | Encourage completion |
| Data Persistence | All data saved to account | Lead capture + continue later |

### Stage 2: Build Your Profile (PAID)

| Feature | Description | Technical Notes |
|---------|-------------|-----------------|
| Corpus Generation | Format samples into Golden Corpus | Server-side processing |
| Voice Extraction | AI analyzes patterns, tone, rhythm | Claude/GPT API call |
| Prompt Generation | Create master instruction prompt | AI generation + templates |
| Multiple Languages | Handle multilingual samples | Auto-detect language |

### Stage 3: Test & Refine (PAID)

| Feature | Description | Purpose |
|---------|-------------|---------|
| Test UI | Enter sample message, see AI response | Validate before deploy |
| Target Platform Selector | Dropdown to select ChatGPT/Claude/Gemini/Other | Optimize response for target platform |
| Test History | All voice tests saved to voice_tests table | Track iterations and improvements |
| Side-by-side | Compare "with twin" vs "without twin" | Show the difference |
| Add More Samples | Continue adding data to improve | Iterative refinement |
| Regenerate | Re-run analysis with new data | Improvement cycle |

### Stage 4: Deploy (PAID)

| Feature | Description | Purpose |
|---------|-------------|---------|
| One-Click Copy | Copy prompt to clipboard | Easy deployment |
| Platform Guides | Step-by-step for GPT/Claude/Gemini | Ensure success |
| Export Options | Download as .txt, .md | Backup and flexibility |
| Download Token System | Token-based file access with expiration and download limits | Secure file delivery |

### Audio Transcription (PAID ADD-ON)

| Audio Length | Price | Rationale |
|--------------|-------|-----------|
| Up to 15 min | $19 | ~$0.10/min API cost + margin |
| 15-60 min | $29 | Volume discount |
| 1-3 hours | $49 | Podcast/long meeting length |

Why paid add-on:
- Whisper API costs ~$0.006/min (cheap but adds up)
- Users who provide audio are higher-intent
- Captures spoken voice patterns (different from written)

### Annual Subscription ($29/year)

| Included | Not Included |
|----------|--------------|
| Unlimited edits to profile | (n/a) |
| Add new samples anytime | |
| Regenerate with new data | |
| New contexts and languages | |
| Priority support | |
| Access to new features | |

**Without subscription**: Profile is locked (read-only). They can still use the exported prompt, but can't update it.

---

# PART 2: BUSINESS MODEL

## 2.1 Revenue Streams

### Primary: One-Time Purchase ($99)

| Item | Price |
|------|-------|
| Full voice profile generation | $99 |
| Includes: Stages 2-4 | |
| Includes: 3 regenerations | |
| Includes: 30-day support | |

### Secondary: Audio Transcription Add-On

| Length | Price | Est. Mix | Revenue/100 users |
|--------|-------|----------|-------------------|
| None | $0 | 60% | $0 |
| Up to 15 min | $19 | 25% | $475 |
| 15-60 min | $29 | 10% | $290 |
| 1-3 hours | $49 | 5% | $245 |
| **Total** | | | **$1,010** |

**Average add-on per paying user**: ~$10

### Tertiary: Annual Subscription ($29/year)

| Scenario | Conversion | Revenue/100 initial users |
|----------|------------|---------------------------|
| Year 1 | 30% convert | $870 |
| Year 2 | 70% retention | $609 |
| Year 3 | 70% retention | $426 |

**LTV impact**: Adds ~$19 average per user over 3 years

### Revenue Summary (per 100 paying users)

| Stream | Revenue |
|--------|---------|
| One-time purchase | $9,900 |
| Audio add-ons | $1,010 |
| Year 1 subscriptions | $870 |
| **Total Year 1** | **$11,780** |

**Average Revenue Per User (ARPU)**: ~$118

---

## 2.2 Free Tier Value (Lead Capture)

### What We Get From Free Users:
1. **Email address** — For marketing and follow-up
2. **Questionnaire data** — Understand their needs
3. **Writing samples** — Proof they're engaged
4. **Usage patterns** — When they drop off

### Lead Nurture Strategy:

| Trigger | Email | Goal |
|---------|-------|------|
| Sign up | Welcome + explain process | Set expectations |
| Questionnaire done | Congrats + samples CTA | Keep momentum |
| 3+ samples added | "You're ready!" + pricing | Convert to paid |
| Abandoned (3 days) | "Finish your twin" | Re-engage |
| Abandoned (7 days) | Limited-time offer (-20%) | Urgency |
| Abandoned (30 days) | "Still want your twin?" | Last chance |

### Projected Conversion Funnel:

| Stage | Rate | Per 1,000 signups |
|-------|------|-------------------|
| Sign up (free) | 100% | 1,000 |
| Complete questionnaire | 60% | 600 |
| Add 5+ samples | 40% | 400 |
| Convert to paid | 25% | 100 |

**Paid conversion rate**: 10% of signups → buyers
**Lead capture rate**: 60% of signups → marketable leads

---

## 2.3 Cost Structure

### Fixed Costs (Monthly)

| Item | Cost |
|------|------|
| Vercel Pro (if needed) | $0-20 |
| Supabase (free tier) | $0 |
| Domain | ~$3 (annual $34) |
| Email (Resend/Loops) | $0-29 |
| **Total Fixed** | **$0-52/month** |

### Variable Costs (Per Paid User)

| Item | Cost | Notes |
|------|------|-------|
| AI API (extraction) | ~$0.50-1.00 | Claude/GPT for analysis |
| AI API (generation) | ~$0.20-0.50 | Prompt generation |
| AI API (testing) | ~$0.10/test | Test UI responses |
| Stripe fees | ~$3.70 | 3.4% + $0.30 on $99 |
| **Total per user** | **~$5-6** | |

### Gross Margin

| Revenue | Costs | Gross Profit | Margin |
|---------|-------|--------------|--------|
| $99 | $6 | $93 | 94% |
| $99 + $29 audio | $7 | $121 | 94% |
| $99 + $29 sub | $6 | $122 | 95% |

**Excellent margins** — AI API costs are minimal per user.

---

## 2.4 Pricing Psychology

### Why $99 One-Time Works:

1. **Value anchor**: "We BUILD it for you" = service, not product
2. **Comparison**: Custom prompt engineering = $500-2,000
3. **Psychology**: Sub-$100 = impulse purchase territory
4. **ROI**: Save 2 hours/week × $50/hr = $5,200/year value

### Why $29/year Subscription Works:

1. **Low commitment**: Less than $3/month
2. **Value clear**: Keep your twin up-to-date
3. **Default opt-in**: Suggest at checkout
4. **Churn-resistant**: Low price = low churn

### Pricing Tiers (Implemented):

| Tier | Price | Includes |
|------|-------|----------|
| **Starter** | $49 | 1 language, 3 contexts, basic support |
| **Complete** | $99 | Multi-language, all contexts, 1 year subscription |
| **Executive** | $249 | Everything in Complete + priority support, advanced analytics, 5 regenerations |
| **Done-For-You** | $499 | Full white-glove service: we collect samples, build profile, and deliver ready-to-use |

---

# PART 3: TECHNICAL REQUIREMENTS

## 3.1 Database Schema (Updated)

```sql
-- Core tables (already created)
profiles              -- User accounts
questionnaire_responses  -- Needs and context
samples               -- Writing samples (corpus)
voice_profiles        -- Generated profiles
purchases             -- Payment records

-- New tables needed
audio_uploads (
  id uuid primary key,
  user_id uuid references profiles,
  file_url text,
  duration_seconds int,
  transcription text,
  status text, -- 'pending', 'processing', 'completed', 'failed'
  cost_cents int,
  created_at timestamp
)

subscriptions (
  id uuid primary key,
  user_id uuid references profiles,
  stripe_subscription_id text,
  status text, -- 'active', 'canceled', 'past_due'
  current_period_start timestamp,
  current_period_end timestamp,
  created_at timestamp
)

voice_tests (
  id uuid primary key,
  user_id uuid references profiles,
  voice_profile_id uuid references voice_profiles,
  input_message text,
  output_response text,
  model_used text,
  created_at timestamp
)
```

## 3.2 API Routes Needed

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/generate-profile` | POST | Run AI extraction + generation |
| `/api/test-voice` | POST | Test voice with sample message |
| `/api/transcribe` | POST | Transcribe audio (paid) |
| `/api/checkout` | POST | Create Stripe checkout |
| `/api/subscription` | POST | Create/manage subscription |
| `/api/webhook/stripe` | POST | Handle Stripe events |

## 3.3 AI Integration

### Extraction Prompt (runs on user's samples)
- Input: Questionnaire responses + all samples
- Output: Structured voice DNA (JSON)
- Model: Claude 3.5 Sonnet (best quality/cost ratio)
- Est. tokens: ~10K input, ~5K output
- Est. cost: ~$0.50

### Generation Prompt (creates master prompt)
- Input: Voice DNA + platform target
- Output: Ultra-detailed instruction prompt
- Model: Claude 3.5 Sonnet
- Est. tokens: ~5K input, ~5K output
- Est. cost: ~$0.25

### Test UI (live testing)
- Input: User message + master prompt
- Output: AI response in their voice
- Model: GPT-4o-mini (fast + cheap for testing)
- Est. tokens: ~2K per test
- Est. cost: ~$0.01/test
- **Target Platform Selector**: User selects ChatGPT/Claude/Gemini/Other to optimize output format
- **Test History**: All tests logged to voice_tests table for tracking and analysis

## 3.4 Download Token System

Secure file delivery using token-based access:

| Feature | Description |
|---------|-------------|
| Token Generation | Unique token created for each download request |
| Expiration | Tokens expire after configurable time period |
| Download Limits | Maximum number of downloads per token |
| Access Logging | All downloads tracked for security auditing |

```sql
download_tokens (
  id uuid primary key,
  user_id uuid references profiles,
  file_path text,
  token text unique,
  expires_at timestamp,
  download_limit int default 5,
  download_count int default 0,
  created_at timestamp
)
```

## 3.5 Analytics & Monitoring

### Vercel Analytics Integration
- **Speed Insights**: Real-time performance monitoring for Core Web Vitals
- **Web Analytics**: Privacy-friendly visitor analytics (no cookies)
- **Implementation**: Integrated via `@vercel/analytics` and `@vercel/speed-insights` packages

## 3.6 Testing Infrastructure

### Comprehensive Test Suite
| Tool | Purpose | Coverage |
|------|---------|----------|
| **Vitest** | Unit testing | Components, utilities, API routes |
| **Playwright** | E2E testing | User flows, checkout, authentication |

Test commands:
```bash
npm run test        # Run Vitest unit tests
npm run test:e2e    # Run Playwright E2E tests
npm run test:all    # Run all tests
```

---

# PART 4: LAUNCH PLAN

## 4.1 MVP Feature Set

### Must Have (Weekend):
- [x] Landing page with clear value prop
- [x] User auth (magic link)
- [x] Questionnaire flow
- [x] Sample collection UI
- [x] AI extraction + generation
- [x] Voice testing UI
- [x] Target platform selector (ChatGPT/Claude/Gemini/Other)
- [x] Test history saving (voice_tests table)
- [x] One-click copy/export
- [x] Download token system (secure file delivery)
- [x] Stripe checkout (4 pricing tiers)
- [ ] Basic email sequence

### Should Have (Week 1):
- [ ] Audio upload + transcription
- [ ] Subscription upsell
- [ ] Regeneration (with new samples)
- [ ] Platform deployment guides

### Could Have (Week 2+):
- [ ] Side-by-side comparison in test UI
- [ ] Multiple voice profiles per user
- [ ] Team/shared voices
- [x] Usage analytics (Vercel Analytics + Speed Insights)

### Infrastructure (Implemented):
- [x] Vercel Analytics integration
- [x] Vercel Speed Insights integration
- [x] Comprehensive test suite (Vitest + Playwright)

## 4.2 Sales Page Messaging Update

### Old (Product/Download Focus):
> "Get the VoiceDNA Kit — prompts and guides to build your digital twin"

### New (Service/Build Focus):
> "We Build Your AI Voice Twin"
>
> You share your writing. We analyze your unique voice patterns. You get a production-ready AI prompt that sounds exactly like you.
>
> Not a DIY kit. Not another prompt pack. A complete service.

### Pricing Section Copy:

```
WHAT YOU GET FOR $99:

✓ Complete voice analysis of your writing samples
✓ AI-powered pattern extraction (tone, rhythm, style)
✓ Production-ready master prompt (5,000+ tokens)
✓ Test your twin before deploying
✓ One-click export to ChatGPT, Claude, or Gemini
✓ Platform-specific setup guides
✓ 3 regenerations included
✓ 30-day email support

Optional Add-Ons:
+ Audio transcription: from $19 (capture your spoken voice)
+ Annual updates: $29/year (edit, add samples, regenerate anytime)
```

---

## 4.3 Success Metrics

### Launch Metrics (Weekend)

| Metric | Target |
|--------|--------|
| Site live | Yes |
| Auth working | Yes |
| Payment working | Yes |
| First signup | Within 24 hours |
| First paid user | Within 48 hours |

### Week 1 Metrics

| Metric | Target |
|--------|--------|
| Free signups | 100+ |
| Questionnaire completions | 50+ |
| Paid conversions | 10+ |
| Revenue | $1,000+ |

### Month 1 Metrics

| Metric | Target |
|--------|--------|
| Free signups | 500+ |
| Paid conversions | 50+ |
| Revenue | $5,000+ |
| Subscription upsells | 15+ |
| Lead nurture conversions | 10+ |

---

*Document version: 2.0*
*Last updated: January 2026*
*Status: Building*
