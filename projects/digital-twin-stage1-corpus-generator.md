# Stage 1: Golden Corpus Generator

**Purpose**: Guide you through collecting the writing samples that will become your Digital Twin's training data.

**Time required**: 1-2 hours
**AI required**: None (except optional audio transcription)

---

## Overview

Your Digital Twin is only as good as the samples you feed it. This guide helps you:

1. **Discover** your communication contexts
2. **Collect** the right samples
3. **Organize** them for analysis

No AI needed here—just copy-paste and light editing.

---

# STEP 1: Context Discovery

## 1.1 Language Inventory

**Which languages do you use professionally?**

| Language | Frequency | Contexts |
|----------|-----------|----------|
| ___________ | Daily / Weekly / Monthly | ___________ |
| ___________ | Daily / Weekly / Monthly | ___________ |
| ___________ | Daily / Weekly / Monthly | ___________ |

**Note**: If you use 2+ languages, you'll need samples in each.

---

## 1.2 Communication Context Map

Check all that apply:

### External Communication (customers, partners, public)

**Written:**
- [ ] Formal emails (negotiations, proposals, important requests)
- [ ] Operational emails (clarifications, follow-ups, coordination)
- [ ] Relationship emails (check-ins, thank-yous, networking)
- [ ] Documents (proposals, reports, presentations)
- [ ] Social media posts (LinkedIn, Twitter)

**Spoken:**
- [ ] Presentations (formal, to external audiences)
- [ ] Client calls (recorded/transcribed)

### Internal Communication (team, colleagues, organization)

**Written:**
- [ ] Slack/Teams messages (quick coordination)
- [ ] Internal emails (updates, requests, FYIs)
- [ ] Documentation (process docs, wikis, handoffs)
- [ ] Performance reviews / feedback

**Spoken:**
- [ ] Team presentations
- [ ] Meeting contributions (if recorded)

### Personal Communication (optional, for full range)

- [ ] Personal emails
- [ ] Social messages
- [ ] Blog posts / personal writing

---

## 1.3 Your Context Matrix

Based on what you checked, fill in your matrix:

| Context | Language(s) | Priority | Sample Count Target |
|---------|-------------|----------|---------------------|
| External formal email | | High / Medium / Low | |
| External operational email | | High / Medium / Low | |
| Internal chat | | High / Medium / Low | |
| Presentations (spoken) | | High / Medium / Low | |
| ... | | | |

**Priority guide:**
- **High**: You do this daily, it's critical to sound like you
- **Medium**: Weekly activity, important but not critical
- **Low**: Occasional, nice to have

---

# STEP 2: Sample Collection

## 2.1 How Many Samples?

| Priority | Minimum | Ideal | Maximum useful |
|----------|---------|-------|----------------|
| High | 5 | 8-10 | 15 |
| Medium | 3 | 5 | 8 |
| Low | 2 | 3 | 5 |

**Total corpus target**: 20-40 samples across all contexts

**Quality > Quantity**: 5 excellent samples beat 20 mediocre ones.

---

## 2.2 What Makes a Good Sample?

### Include samples that:

- [x] **Are 100% written by you** (not heavily edited by others)
- [x] **Represent your natural voice** (not forced or unusual circumstances)
- [x] **Are complete** (full email/message, not fragments)
- [x] **Show your reasoning** (especially for complex/persuasive writing)
- [x] **Vary in purpose** (some informing, some persuading, some coordinating)

### Avoid samples that:

- [ ] Were written under extreme time pressure (not representative)
- [ ] Were heavily templated (legal boilerplate, form letters)
- [ ] Are too short (<50 words for written, <1 min for spoken)
- [ ] Were collaborative writing (unclear what's yours)
- [ ] Contain only factual reporting (no voice to extract)

---

## 2.3 Sample Collection Checklist

### External Written Communication

**Formal/Strategic Emails** (negotiation, defense, persuasion)
- [ ] Sample 1: ___ (describe: e.g., "pricing negotiation rejection")
- [ ] Sample 2: ___
- [ ] Sample 3: ___
- [ ] Sample 4: ___
- [ ] Sample 5: ___

Look for emails where you:
- Defended a position
- Said no diplomatically
- Made a persuasive case
- Navigated a difficult situation

**Operational Emails** (clarification, coordination, follow-up)
- [ ] Sample 1: ___
- [ ] Sample 2: ___
- [ ] Sample 3: ___

Look for emails where you:
- Clarified something complex
- Coordinated across parties
- Followed up professionally

**Relationship Emails** (warm, networking, gratitude)
- [ ] Sample 1: ___
- [ ] Sample 2: ___

Look for emails where you:
- Built rapport
- Expressed genuine appreciation
- Reconnected after time

---

### Internal Written Communication

**Slack/Teams Messages** (efficient, direct)
- [ ] Sample 1: ___
- [ ] Sample 2: ___
- [ ] Sample 3: ___
- [ ] Sample 4: ___
- [ ] Sample 5: ___

Look for messages where you:
- Gave clear direction
- Shared an update efficiently
- Asked a precise question
- Gave feedback or kudos

**Internal Emails/Docs** (reporting, strategy)
- [ ] Sample 1: ___
- [ ] Sample 2: ___
- [ ] Sample 3: ___

---

### Spoken Communication (if applicable)

**Presentations**
- [ ] Sample 1: ___ (topic, length: __ minutes)
- [ ] Sample 2: ___

**Meeting Contributions**
- [ ] Sample 1: ___

**Note on transcription**: See Section 2.5 below.

---

## 2.4 Where to Find Your Samples

| Source | How to access |
|--------|---------------|
| Email (sent folder) | Search your sent folder by date range, keyword, or recipient |
| Slack/Teams | Export your messages or copy from specific channels |
| Google Docs | Check "Owned by me" filter |
| Presentations | Look for speaker notes or recordings |
| Calendar | Find past presentations/meetings that were recorded |
| LinkedIn | Check your posted content |

**Pro tip**: Search for emails you remember being proud of, or conversations where you felt you communicated effectively.

---

## 2.5 Audio Transcription (for Spoken Samples)

If you have recordings of yourself speaking (presentations, podcasts, meetings):

### Option A: Built-in transcription
- **Zoom**: Check cloud recordings for auto-transcripts
- **Teams**: Transcripts available in meeting recap
- **Google Meet**: Transcripts in Google Drive
- **Loom**: Auto-transcription included

### Option B: AI transcription services
- **Whisper** (free, local): Best accuracy
- **Otter.ai** (freemium): Easy to use
- **Rev** (paid): Human-reviewed option

### Option C: Manual (for short clips)
- Play and type (tedious but works for <5 min)

**Important**: Keep transcripts raw—include "um", "uh", pauses. The forensic analysis needs to see your natural spoken patterns. Cleanup happens later in the Runtime Block.

---

# STEP 3: Sample Formatting

## 3.1 Standard Format

Wrap each sample in this structure:

```
<SAMPLE mode="[MODE]" type="[TYPE]" language="[LANG]">

[Context: Brief description of the situation - 1-2 sentences]
[Tone: 2-3 adjectives describing the intended tone]

[YOUR ACTUAL TEXT HERE - unedited, complete]

</SAMPLE>
```

### Mode values:
- `External_Written` - Customer/partner/public emails and documents
- `Internal_Written` - Team/colleague Slack, email, docs
- `External_Spoken` - Presentations, client calls
- `Internal_Spoken` - Team meetings, internal presentations
- `Personal` - Personal communication (optional)

### Type values (examples):
- `Negotiation`, `Defense`, `Persuasion`
- `Clarification`, `Coordination`, `Follow_up`
- `Relationship`, `Greeting`, `Gratitude`
- `Directive`, `Update`, `Inquiry`
- `Presentation`, `Demo`, `Teaching`

### Language values:
- `English`, `Japanese`, `French`, `Spanish`, etc.

---

## 3.2 Example Formatted Sample

```
<SAMPLE mode="External_Written" type="Negotiation" language="English">

Context: Rejecting a customer's request to amend a proposal after extensive internal advocacy.
Tone: Firm, Value-Driven, Polite but Unyielding.

Hello [Client Name],

Thank you for your patience while we worked on this.

Following your request, I want to assure you that we have spent a significant amount of time and effort engaging with our headquarters and product teams. We advocated strongly on behalf of [Company], fully appreciating your position.

Unfortunately, despite these extensive efforts, we have been unable to secure approval to amend the proposal. The position from HQ is firm, driven by the significant additional value and the underlying cost structure.

Therefore, we must maintain our current offer.

I understand this is not the update you were hoping for. We remain happy to provide any further documentation that might assist in your internal processes.

Kind regards,
[Your Name]

</SAMPLE>
```

---

## 3.3 Anonymization Guidelines

Before adding samples to your corpus, anonymize:

| Replace | With |
|---------|------|
| Client/company names | `[Client Company]`, `[Partner Name]` |
| Colleague names | `[Colleague Name]`, `[Manager Name]` |
| Specific amounts | `[Amount]`, `[$XX,XXX]`, `[XX%]` |
| Dates | `[Date]`, `[Month Year]` |
| Internal project names | `[Project Name]`, `[Initiative]` |
| Email addresses | `[EMAIL REDACTED]` |
| Phone numbers | `[PHONE REDACTED]` |
| URLs/links | `[LINK REMOVED]` |

**Keep intact:**
- Your sentence structure
- Your word choices
- Your logical flow
- Your punctuation patterns
- Your greeting/closing styles

---

# STEP 4: Corpus Organization

## 4.1 File Structure

Create a single document called `Golden_Corpus.md` with this structure:

```markdown
# Golden Corpus: [Your Name]'s Voice DNA

**Date compiled**: [Date]
**Languages**: [List]
**Total samples**: [Count]

---

## Part 1: External Written Communication

### 1.1 English External

<SAMPLE mode="External_Written" type="Negotiation" language="English">
...
</SAMPLE>

<SAMPLE mode="External_Written" type="Clarification" language="English">
...
</SAMPLE>

### 1.2 Japanese External (if applicable)

<SAMPLE mode="External_Written" type="Inquiry" language="Japanese">
...
</SAMPLE>

---

## Part 2: Internal Written Communication

### 2.1 English Internal

<SAMPLE mode="Internal_Written" type="Directive" language="English">
...
</SAMPLE>

### 2.2 Japanese Internal (if applicable)

...

---

## Part 3: Spoken Communication (if applicable)

### 3.1 English Spoken

<SAMPLE mode="External_Spoken" type="Presentation" language="English">
...
</SAMPLE>

### 3.2 Japanese Spoken (if applicable)

...

---

## Corpus Summary

| Category | Language | Sample Count |
|----------|----------|--------------|
| External Written | English | X |
| External Written | Japanese | X |
| Internal Written | English | X |
| Internal Written | Japanese | X |
| Spoken | English | X |
| Spoken | Japanese | X |
| **Total** | | **XX** |
```

---

## 4.2 Quality Checklist

Before moving to Stage 2, verify:

**Coverage:**
- [ ] All high-priority contexts have 5+ samples
- [ ] All languages you use are represented
- [ ] Both formal and informal registers are included
- [ ] (If applicable) Both written and spoken are included

**Quality:**
- [ ] All samples are 100% your writing/speaking
- [ ] All samples are complete (not fragments)
- [ ] All samples are properly anonymized
- [ ] All samples use the standard format

**Organization:**
- [ ] Single document with clear structure
- [ ] Summary table is accurate
- [ ] Context and tone noted for each sample

---

# STEP 5: Ready for Stage 2

## Your Golden Corpus is complete when:

1. **Minimum 20 samples** across your contexts
2. **All languages covered** that you want your Twin to use
3. **All priority contexts covered** (especially High priority)
4. **Properly formatted** with mode/type/language tags
5. **Anonymized** (no confidential info exposed)

## Next Step

Take your completed `Golden_Corpus.md` to **Stage 2: Master Extraction Prompt**.

The Forensic Linguist will analyze your corpus and extract your Voice DNA markers.

---

# Appendix: Quick Reference

## Sample Count Guide

| Your situation | Recommended total |
|----------------|-------------------|
| Single language, 2-3 contexts | 15-20 samples |
| Single language, 4-5 contexts | 25-30 samples |
| Two languages, 3-4 contexts each | 30-40 samples |
| Three languages, multiple contexts | 40-50 samples |

## Time Estimates

| Task | Time |
|------|------|
| Context discovery | 15-20 min |
| Finding samples in email/Slack | 30-45 min |
| Formatting and anonymizing | 30-45 min |
| Audio transcription (if needed) | Varies (use AI) |
| Quality check | 10-15 min |
| **Total** | **1.5-2 hours** |

## Common Mistakes to Avoid

1. **Too few samples**: 5 samples won't capture your range
2. **All same type**: Need variety (not just negotiations OR just updates)
3. **Edited samples**: Don't "improve" them—include authentic writing
4. **Missing contexts**: Don't skip internal/casual if you use them daily
5. **Over-anonymizing**: Keep your word choices, just remove names/numbers

---

*Stage 1 Complete → Proceed to Stage 2: Master Extraction Prompt*
