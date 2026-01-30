# User Journey Improvements

**Created**: January 2026
**Purpose**: Track feedback and improvements identified during user journey review

---

## Step 1: Landing Page

**Current State**: Sales-focused page with hero, problem/solution copy, pricing cards (4 tiers)

**Feedback/Improvements**:
- [ ] Missing copy for multilingual target users

---

## Step 2: Checkout Flow

**Current State**: User clicks pricing card on landing page → Stripe checkout → Success page (purchase-first flow)

**Feedback/Improvements**:
- [ ] **MAJOR**: Flow order is wrong. User should NOT see checkout first.
  - Correct flow: User builds their voice first (questionnaire + samples = Phase 1)
  - Only after Phase 1 is complete, show checkout
  - This ensures user is committed before paying (invested time/effort)

---

## Step 5: Questionnaire

**Current State**: 4-step wizard collecting profession, industry, formality level, tone preferences, pet phrases, goals, etc.

**Feedback/Improvements**:
- [ ] **MAJOR**: Questions are wrong. Most details (tone, formality, phrases) will be deduced from the golden corpus analysis.
- [ ] Should focus on building the **Corpus Matrix** instead:
  - **Languages**: Which languages does the user communicate in?
  - **Communication Format**: Text only OR Text + Voice (for speech/presentation scripts)
  - **Communication Tools**: Email, Slack, Teams, Documents, Social media, etc.
  - **Communication Targets**: Customers, Internal team, Executives, Public, etc.
- [ ] Matrix is sparse — not all combinations apply. Example: User may never communicate with customers via Slack in French.
- [ ] Purpose: Guide sample collection (Phase 1) by identifying which matrix cells the user needs.

---

## Step 6: Success Page

**Current State**: *(to be reviewed)*

**Feedback/Improvements**:
- *(awaiting feedback)*

---

## Step 4: Dashboard

**Current State**: *(to be reviewed)*

**Feedback/Improvements**:
- *(awaiting feedback)*

---

## Step 5: Questionnaire

**Current State**: *(to be reviewed)*

**Feedback/Improvements**:
- *(awaiting feedback)*

---

## Step 6: Samples

**Current State**: Manual paste-only sample collection, global minimum of 5 samples, no connection to questionnaire, no audio support

**Feedback/Improvements**:
- [ ] **MAJOR**: Minimum 5 samples should be **per matrix section**, not global
- [ ] Connect to matrix questionnaire — guide user through each matrix cell they defined
- [ ] Make it gradual — walk user through sections one by one
- [ ] Allow bypass with acknowledgment:
  - If some sections meet minimum but others don't, user can proceed
  - Must explicitly acknowledge: "These sections will not be representative"
  - Show clear warning about incomplete sections
- [ ] **Audio input** requires additional payment:
  - Pricing based on file size OR recording length
  - Use Whisper API costs + margin
  - Show cost estimate before upload/recording

---

## Step 7: Checkout & Generation

**Current State**: Combined page with 4 states (not_ready, ready_not_paid, generating, generated). Hardcoded $99 + $29 audio add-on. No corpus analysis before payment.

**Feedback/Improvements**:
- [ ] **Stripe compliance**: Add required legal pages (TOS, Privacy Policy, Refund Policy) - confirm exact requirements
- [ ] **Show all plan options**: Display the 4 pricing tiers (Starter $49, Complete $99, Executive $249, Done-For-You $499), not hardcoded single price
- [ ] **Audio transcription pricing**: Should be dynamic (Whisper API cost + margin), not flat $29
- [ ] **MAJOR - Pre-payment reassurance**: Before showing payment options, run initial AI analysis of golden corpus:
  - Summarize data coverage: "That's comprehensive data across a rich set of scenarios"
  - Analyze overall style: "Your overall style is humorous and friendly"
  - Note context variations: "Customer-facing communication is frank and detail-oriented"
  - Highlight quirks: "I noticed a few quirks such as X that we will include in the style guide"
  - THEN show payment options
- [ ] Flow becomes: Phase 1 complete → AI Analysis Preview → Payment → Full Generation

---

## Step 8: Deploy/Test

**Current State**: *(to be reviewed)*

**Feedback/Improvements**:
- *(awaiting feedback)*

---

*Document will be updated as we review each step*
