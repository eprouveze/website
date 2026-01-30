# My Voice Twin: GTM Launch Playbook

**Purpose**: Tactical guide for acquiring users and driving traffic to myvoicetwin.io
**Focus**: Automated + organic (non-paid) strategies
**Version**: 1.1
**Updated**: January 2026

---

## Executive Summary

**Target Markets** (from market research):
1. **Primary**: Bilingual/multilingual professionals (320K underserved segment)
2. **Secondary**: ChatGPT Plus subscribers (18M+ potential users)
3. **Tertiary**: Executives with heavy communication workloads

**Goal**: 1,000 customers in Year 1 = $100K revenue (0.05% of 2M SAM)

**Philosophy**: Automate everything possible. Build systems that generate leads while you sleep.

---

## 1. Automation Stack

### 1.1 Recommended Tools (Free/Low-Cost)

| Function | Tool | Cost | Automation Level |
|----------|------|------|------------------|
| **Email sequences** | Loops.so / Resend | Free tier | Full auto |
| **Social scheduling** | Buffer / Typefully | Free tier | Schedule + auto-post |
| **SEO monitoring** | Google Search Console | Free | Weekly reports |
| **Analytics** | Vercel Analytics | Included | Auto tracking |
| **Form handling** | Built into app | Free | Auto to Supabase |
| **Webhook automation** | Supabase Edge Functions | Free tier | Event-driven |
| **RSS to social** | IFTTT / Zapier | Free tier | Auto-post new content |

### 1.2 Automation Flows to Build

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATED LEAD CAPTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Blog Post Published                                             │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │ Auto-tweet  │───▶│ Auto-LinkedIn│───▶│ RSS Feed    │          │
│  │ (Typefully) │    │ (Buffer)     │    │ (built-in)  │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATED EMAIL SEQUENCES                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User Signs Up ──▶ Welcome Email (Day 0)                        │
│       │                    │                                     │
│       │                    ▼                                     │
│       │           Education Email (Day 2)                        │
│       │                    │                                     │
│       │                    ▼                                     │
│       │           Social Proof Email (Day 4)                     │
│       │                    │                                     │
│       │                    ▼                                     │
│       │           CTA Email (Day 7)                              │
│       │                                                          │
│       ▼                                                          │
│  Completes Questionnaire ──▶ "Ready to generate!" (immediate)   │
│       │                                                          │
│       ▼                                                          │
│  Abandons (3 days) ──▶ Re-engagement sequence                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATED REFERRAL PROGRAM                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Customer Purchase                                               │
│       │                                                          │
│       ▼                                                          │
│  Auto-generate referral link (Supabase function)                │
│       │                                                          │
│       ▼                                                          │
│  Include in thank-you email + dashboard                         │
│       │                                                          │
│       ▼                                                          │
│  Track referrals ──▶ Auto-credit discounts                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Channel Strategy (Organic Only)

### 2.1 Priority Channels (No Personal Involvement)

| Channel | Target Audience | Priority | Automation Level |
|---------|-----------------|----------|------------------|
| SEO/Blog | Search traffic | HIGH | 100% - publish and forget |
| Reddit monitoring | AI communities | HIGH | 90% - auto-find, quick reply |
| Product Hunt | Early adopters | MEDIUM | One-time launch |
| Email sequences | Existing leads | HIGH | 100% automated |
| Auto-tweet on publish | AI enthusiasts | MEDIUM | 100% - RSS trigger |

### 2.2 Reddit Automation Strategy

#### Automated Monitoring Setup

**Tools**:
- **F5Bot** (free) - Email alerts when keywords appear on Reddit
- **Visualping** (free tier) - Monitor specific subreddit pages
- **IFTTT** (free) - "If Reddit post contains X, then email me"

**Keywords to Monitor**:
```
Primary (high intent):
- "ChatGPT sounds like"
- "AI doesn't sound like me"
- "custom GPT voice"
- "AI writing voice"

Secondary (problem aware):
- "rewriting AI drafts"
- "ChatGPT generic"
- "AI email writing"
- "multilingual AI"

Niche:
- "keigo ChatGPT"
- "Japanese business email AI"
- "French formality AI"
```

**Target Subreddits**:
| Subreddit | Size | Best Post Types |
|-----------|------|-----------------|
| r/ChatGPT | 5M+ | Helpful comments on voice problems |
| r/artificial | 1M+ | Discussion about limitations |
| r/productivity | 2M+ | Time-saving solutions |
| r/languagelearning | 1M+ | Multilingual angle |
| r/Entrepreneur | 1M+ | Tool recommendations |
| r/SideProject | 100K | Launch announcements (allowed) |

#### Response Templates (Copy-Paste Ready)

**Template 1: Someone asks about AI voice**
```
I built something for exactly this problem. The key is giving the AI
specific patterns from your actual writing - sentence length,
transition words, punctuation habits.

If you want to try a systematic approach: [link]

Happy to answer questions about the methodology.
```

**Template 2: Someone complains about generic AI**
```
Yeah, "write in a professional tone" doesn't work because
"professional" means different things to different people.

What worked for me: analyzing 10+ of my own emails to extract
the actual patterns, then creating detailed instructions from that.

There are tools that automate this process if you don't want to
do it manually.
```

**Template 3: Multilingual question**
```
This is a huge problem for multilingual writers. My Japanese emails
need keigo, my English is more direct - ChatGPT treats them the same.

The solution is language-specific voice profiles. I use [tool]
to create separate patterns for each language that the AI
auto-detects and applies.
```

#### Posting Rules (Stay Safe)
1. **Never spam** - Only respond when genuinely helpful
2. **Value first** - Give useful info before any link
3. **Disclose** - If asked, admit you built the tool
4. **Respect rules** - Each subreddit has different self-promo rules
5. **Build karma** - Helpful comments with no links build credibility

#### Product Hunt Launch

**Preparation (2 weeks before)**:
- [ ] Create Product Hunt maker account
- [ ] Prepare assets: logo, screenshots, tagline
- [ ] Write compelling description
- [ ] Pre-write 10 response templates

**Launch Day Assets**:
| Asset | Specs |
|-------|-------|
| Logo | 240x240px PNG |
| Gallery images | 1270x760px (5 images) |
| Tagline | "Your voice. Any AI. Every language." (60 chars max) |
| Description | 260 chars first paragraph hook |

**Pre-Written Response Templates**:
```
Q: "How is this different from custom instructions?"
A: "Custom instructions are a starting point, but they're generic.
   This analyzes YOUR actual writing patterns - sentence rhythm,
   transitions, punctuation habits - and creates specific rules
   the AI follows. The difference is night and day."

Q: "Does this work with Claude/Gemini?"
A: "Yes! The output is platform-agnostic. We include specific
   setup guides for ChatGPT Custom GPTs, Claude Projects, and
   Gemini Gems. Same voice profile works everywhere."

Q: "How long does setup take?"
A: "About 3 hours total: 1-2 hours gathering writing samples,
   30-60 min running the extraction, 15 min deploying. One-time
   setup for a system you use daily."
```

#### Auto-Tweet on Publish (No Personal Involvement)

**Setup with IFTTT/Zapier**:
```
Trigger: New item in blog RSS feed
Action: Post tweet with title + link

Template:
"New post: {title}

{excerpt}

Read more: {link}

#AI #ChatGPT #productivity"
```

**Alternative: Typefully RSS Integration**
1. Connect blog RSS to Typefully
2. Auto-generate tweet from post title
3. Posts automatically when blog publishes

**Zero effort after setup** - just publish blog posts.

---

## 2. Content Marketing

### 3.1 SEO Keywords

**Primary Keywords** (high intent):
| Keyword | Monthly Volume | Difficulty | Landing Page |
|---------|---------------|------------|--------------|
| "AI that sounds like me" | 500+ | Low | Homepage |
| "custom ChatGPT voice" | 1K+ | Medium | /for/chatgpt-users |
| "clone my writing style AI" | 300+ | Low | Homepage |
| "ChatGPT custom instructions voice" | 800+ | Medium | /for/chatgpt-users |

**Secondary Keywords** (problem-aware):
| Keyword | Monthly Volume | Content Type |
|---------|---------------|--------------|
| "ChatGPT sounds robotic" | 2K+ | Blog post |
| "AI writing doesn't sound like me" | 500+ | Blog post |
| "multilingual AI writing" | 400+ | /for/multilingual |
| "keigo AI Japanese" | 100+ | Blog post |

**Long-tail Keywords** (low competition):
- "how to make ChatGPT write in my style"
- "custom GPT for email writing"
- "AI writing assistant multilingual"
- "voice cloning for text not audio"

### 3.2 Automated SEO Monitoring

**Google Search Console Setup**:
1. Verify domain ownership
2. Submit sitemap.xml
3. Enable email alerts for issues
4. Set up weekly performance report (auto-email)

**Automated Tracking**:
```
Weekly auto-report includes:
├── Top performing pages
├── Keywords gaining impressions
├── Click-through rates
├── Pages with errors
└── New backlinks detected
```

### 3.3 Blog Content Plan

**Launch Content** (publish before launch):
| Title | Target Keyword | Purpose |
|-------|---------------|---------|
| "Why AI Writing Doesn't Sound Like You (And How to Fix It)" | AI writing doesn't sound like me | Problem awareness |
| "The Complete Guide to Custom GPT Instructions" | custom GPT instructions | SEO + value |
| "How I Cloned My Voice Across 3 Languages" | multilingual AI writing | Story + product intro |

**Ongoing Content** (1-2 posts/month):
| Title | Target Keyword | Type |
|-------|---------------|------|
| "ChatGPT vs Claude vs Gemini for Voice Cloning" | comparison | SEO |
| "The Hidden Cost of Generic AI Writing" | problem | Awareness |
| "5 Signs Your AI Writing Needs a Voice Profile" | listicle | Engagement |
| "How to Write Japanese Business Emails with AI" | keigo | Niche SEO |
| "AI Writing for Executives: A Time ROI Analysis" | executives | Segment |

### 3.4 Content Repurposing Automation

**One Blog Post → 10+ Content Pieces** (automated flow):

```
Blog Post Published
       │
       ├──▶ Auto-tweet thread (Typefully)
       │         └── 5-7 tweets extracted from post
       │
       ├──▶ LinkedIn post (Buffer)
       │         └── Key insight + link
       │
       ├──▶ Email newsletter (Loops)
       │         └── Summary + link to full post
       │
       ├──▶ RSS feed update (automatic)
       │
       └──▶ [Manual] Reddit comment when relevant
```

**Content Template Library** (pre-written, just customize):

| Template | Use Case | Time to Customize |
|----------|----------|-------------------|
| Twitter thread | New blog post | 5 min |
| LinkedIn post | New blog post | 5 min |
| Email newsletter | Weekly digest | 10 min |
| Problem/solution post | Evergreen content | 10 min |
| User result highlight | Social proof | 5 min |

### 2.3 Lead Magnets

**Free Resources** (email capture):
| Resource | Target Segment | Delivery |
|----------|---------------|----------|
| "Voice Profile Self-Assessment" | All | PDF download |
| "10 Prompts to Test Your AI's Voice" | ChatGPT users | Email sequence |
| "Multilingual AI Writing Checklist" | Multilingual pros | PDF download |
| "Executive Email Templates" | Executives | PDF download |

---

## 3. Email Marketing

### 3.1 List Building

**Capture Points**:
1. Homepage newsletter signup
2. Free tier account creation (questionnaire)
3. Blog content upgrades
4. Lead magnet downloads

**Expected Growth**:
| Source | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Organic signups | 50 | 200 | 500 |
| Content upgrades | 20 | 100 | 300 |
| Product Hunt | 200 | - | - |
| Total | 270 | 300 | 800 |

### 3.2 Email Sequences

**Welcome Sequence** (new signups):
| Email | Timing | Subject | Goal |
|-------|--------|---------|------|
| 1 | Immediate | "Welcome! Here's what to expect" | Set expectations |
| 2 | Day 2 | "The 3 types of AI voice problems" | Education |
| 3 | Day 4 | "How [Name] saves 5 hours/week" | Social proof |
| 4 | Day 7 | "Ready to build your voice twin?" | CTA to free tier |

**Abandoned Cart** (started free, didn't pay):
| Email | Timing | Subject | Goal |
|-------|--------|---------|------|
| 1 | Day 1 | "Your voice profile is waiting" | Reminder |
| 2 | Day 3 | "Quick question about your samples" | Engagement |
| 3 | Day 7 | "20% off — finish your twin this week" | Urgency |

**Post-Purchase** (customers):
| Email | Timing | Subject | Goal |
|-------|--------|---------|------|
| 1 | Immediate | "You're in! Here's your next step" | Onboarding |
| 2 | Day 3 | "How's your voice profile working?" | Check-in |
| 3 | Day 14 | "Quick wins with your digital twin" | Value reinforcement |
| 4 | Day 30 | "Time to update your voice?" | Subscription upsell |

---

## 4. Partnerships & Outreach

### 4.1 Newsletter Features (Free/Earned)

**Approach**: Get featured organically, not through paid sponsorship.

**Target Newsletters for Organic Coverage**:
| Newsletter | Approach | What to Pitch |
|------------|----------|---------------|
| The Rundown AI | Submit via tips form | "New tool for multilingual AI writing" |
| Ben's Bites | Direct email to Ben | Indie hacker story angle |
| Product Hunt Daily | Automatic if trending | Coordinate with PH launch |
| Superhuman | Submit tip | Productivity angle |

**Pitch Template (Organic Feature)**:
```
Subject: Story tip — Solving the "ChatGPT sounds like ChatGPT" problem

Hi [Name],

Thought you might find this interesting for [Newsletter]:

I just launched My Voice Twin — it creates AI voice profiles for
multilingual professionals. It solves a problem I was personally
having: my Japanese emails need keigo, my French needs different
formality, but ChatGPT treats them all the same.

Built it for myself, now others are using it.

Happy to share more if you're interested.

Best,
[Name]
```

**Key Difference**: Position as a story/tip, not an ad. Free coverage > paid ads.

### 4.2 Passive Affiliate Discovery

**Let affiliates find you** (no outreach required):

**Setup**:
1. Create `/affiliates` page explaining program
2. Add "Become an affiliate" link in footer
3. List on affiliate directories (free):
   - ShareASale (if you use their platform)
   - Impact affiliate marketplace
   - PartnerStack directory

**Self-Service Affiliate Signup**:
```
/affiliates page includes:
├── Commission structure (20% lifetime)
├── Cookie duration (30 days)
├── Marketing materials (auto-download)
├── Self-signup form → auto-generates links
└── Dashboard for tracking
```

**Automated Affiliate Flow**:
```
Affiliate signs up on /affiliates page
       │
       ▼
Auto-generate unique affiliate code
       │
       ▼
Email with link + marketing materials
       │
       ▼
They promote (no involvement from you)
       │
       ▼
Sales tracked automatically via Stripe
       │
       ▼
Monthly auto-payout (Stripe Connect)
```

**Zero maintenance** after initial setup.

---

## 5. Automated Referral System

### 5.1 Database Schema Addition

```sql
-- Add to Supabase
referral_codes (
  id uuid primary key,
  user_id uuid references profiles,
  code text unique,  -- e.g., "JOHN20"
  discount_percent int default 20,
  uses int default 0,
  max_uses int default null,  -- null = unlimited
  created_at timestamp
)

referral_credits (
  id uuid primary key,
  referrer_id uuid references profiles,
  referred_purchase_id uuid references purchases,
  credit_amount_cents int,  -- e.g., 2000 = $20
  status text,  -- 'pending', 'credited', 'paid_out'
  created_at timestamp
)
```

### 5.2 Referral Flow (Fully Automated)

```
Customer purchases
       │
       ▼
Stripe webhook fires
       │
       ▼
Edge Function: Generate referral code
       │
       ▼
Store in referral_codes table
       │
       ▼
Include in thank-you email (auto)
       │
       ▼
Show in dashboard: "Share & earn $20"
       │
       ▼
Friend uses code at checkout
       │
       ▼
Stripe applies discount (coupon)
       │
       ▼
Edge Function: Credit referrer
       │
       ▼
Email referrer: "You earned $20!"
```

### 5.3 Referral Incentives

| Action | Referrer Gets | Friend Gets |
|--------|---------------|-------------|
| Friend signs up (free) | Nothing | - |
| Friend purchases Starter | $10 credit | 20% off |
| Friend purchases Pro | $20 credit | 20% off |
| Friend purchases Executive | $50 credit | 20% off |

**Credit Usage**: Apply to subscription renewals or future purchases.

---

## 6. Launch Week Timeline (Minimal Involvement)

### Pre-Launch (Week -1)

| Day | Task | Time | Automation |
|-----|------|------|------------|
| -7 | Finalize landing pages | 2 hrs | One-time |
| -6 | Set up email sequences (Loops) | 3 hrs | 100% auto after |
| -5 | Set up Reddit monitoring (F5Bot) | 30 min | Auto alerts |
| -4 | Prepare Product Hunt assets | 2 hrs | One-time |
| -3 | Set up RSS → Twitter automation | 30 min | 100% auto after |
| -2 | Publish 3 launch blog posts | 4 hrs | Auto-distribute |
| -1 | Final testing | 1 hr | One-time |

### Launch Day

| Time | Task | Effort |
|------|------|--------|
| 12:01 AM PST | Submit to Product Hunt | 5 min |
| Morning | Post to r/SideProject | 10 min |
| Throughout | Respond to PH comments (use templates) | 30 min total |
| End of day | Send email to list (pre-written) | 5 min |

### Post-Launch (Autopilot)

| Trigger | Auto-Action |
|---------|-------------|
| New PH comment | Email notification → respond with template |
| Reddit keyword match | F5Bot email → respond if relevant |
| New blog post | Auto-tweet via RSS |
| New signup | Welcome email sequence starts |
| Abandoned questionnaire | Re-engagement email (Day 3) |
| Purchase | Referral code generated + thank-you email |

**Daily time after launch**: 15-30 min (Reddit responses only)

---

## 7. Metrics & Tracking

### 7.1 Key Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Landing page visits | 5,000 | 15,000 |
| Free signups | 500 | 1,500 |
| Paid conversions | 50 | 150 |
| Revenue | $5,000 | $15,000 |
| Email list size | 300 | 1,000 |

### 7.2 Channel Attribution

**UTM Structure**:
```
?utm_source=[channel]&utm_medium=[type]&utm_campaign=[name]
```

**Examples**:
- `?utm_source=twitter&utm_medium=organic&utm_campaign=launch`
- `?utm_source=producthunt&utm_medium=referral&utm_campaign=launch`
- `?utm_source=newsletter&utm_medium=paid&utm_campaign=bensbites`

### 7.3 Analytics Setup

- [ ] Vercel Analytics (already integrated)
- [ ] Google Analytics 4
- [ ] Hotjar or similar for heatmaps
- [ ] Stripe Dashboard for revenue
- [ ] Email platform analytics

---

## 8. Budget Summary

### Zero-Cost GTM Stack

| Activity | Time Investment | Tools Cost | Automation Level |
|----------|-----------------|------------|------------------|
| Twitter/LinkedIn content | 2 hrs/week (batched) | $0 | 80% automated |
| Product Hunt launch | 10 hrs total | $0 | One-time |
| Blog content | 4 hrs/post | $0 | Auto-distribute |
| Email sequences | 8 hrs setup | $0 (Loops free tier) | 100% automated |
| SEO | 1 hr/week | $0 | Auto-reports |
| Referral program | 4 hrs setup | $0 | 100% automated |

### Time Investment (After Setup)

| Phase | Weekly Time | Focus |
|-------|-------------|-------|
| Setup (Week 1-2) | 20 hrs | Build all automations |
| Maintenance (Ongoing) | 3-5 hrs | Respond, create 1 post |
| Content creation | 4 hrs/mo | 1-2 blog posts |

### Total Cost

| Item | Cost |
|------|------|
| Domain | ~$15/year |
| Email (Loops/Resend) | $0 (free tier) |
| Scheduling (Buffer/Typefully) | $0 (free tier) |
| Hosting (Vercel) | $0 (free tier) |
| Database (Supabase) | $0 (free tier) |
| **Total Monthly** | **$0** |
| **Total Annual** | **~$15** |

---

## 9. Quick Reference Checklists

### Launch Day Checklist

- [ ] Product Hunt submitted at 12:01 AM PST
- [ ] r/SideProject post published
- [ ] Email sent to list (pre-written, one click)
- [ ] All links tested and working
- [ ] Stripe checkout tested
- [ ] Respond to PH comments with templates

### Weekly Tasks (30 min/week max)

| Task | Time | Frequency |
|------|------|-----------|
| Check F5Bot Reddit alerts | 10 min | Daily-ish |
| Respond to relevant Reddit threads | 15 min | When alerted |
| Review email sequence stats | 5 min | Weekly |
| Check Vercel Analytics | 5 min | Weekly |
| Publish blog post (optional) | 2-4 hrs | Monthly |

### Fully Automated (Zero Weekly Effort)

- [x] New signups → welcome email sequence
- [x] Abandoned carts → re-engagement emails
- [x] Purchases → referral code + thank-you email
- [x] Blog posts → auto-tweet
- [x] SEO → auto-indexed, auto-reported
- [x] Referrals → auto-tracked, auto-credited

---

*GTM Playbook v1.0 — Ready for launch*
