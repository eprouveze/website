# My Voice Twin - User Guide

**Version**: 1.0
**Last Updated**: January 2026

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [The Corpus Matrix](#the-corpus-matrix)
3. [Adding Writing Samples](#adding-writing-samples)
4. [Generating Your Voice Twin](#generating-your-voice-twin)
5. [Testing Your Voice Twin](#testing-your-voice-twin)
6. [Deploying to AI Platforms](#deploying-to-ai-platforms)
7. [Audio Transcription](#audio-transcription)
8. [Subscriptions & Updates](#subscriptions--updates)
9. [Support](#support)
10. [FAQ](#faq)

---

## Getting Started

### What is My Voice Twin?

My Voice Twin creates a personalized AI writing assistant that captures your unique communication style. Instead of getting generic AI responses, your Voice Twin writes like you - maintaining your tone, vocabulary, and patterns across all your communications.

### How It Works

1. **Define Your Matrix** - Tell us about your communication contexts
2. **Add Samples** - Upload examples of your writing
3. **Generate Profile** - AI analyzes your style to create a "Voice DNA"
4. **Deploy & Use** - Use your Voice Twin in ChatGPT, Claude, or Gemini

### Creating an Account

1. Visit [myvoicetwin.io](https://myvoicetwin.io)
2. Click "Get Started" or "Start Free"
3. Enter your email address
4. Check your inbox for the magic link (no password needed!)
5. Click the link to access your dashboard

---

## The Corpus Matrix

The Corpus Matrix helps us understand HOW, WHERE, and with WHOM you communicate.

### Step 1: Languages

Select all languages you write in:
- English, French, Spanish, German, Japanese, Chinese, etc.
- Your Voice Twin can maintain your style across multiple languages

### Step 2: Communication Tools

Where do you write most often?
- **Email** - Professional correspondence
- **Slack/Teams** - Quick team messages
- **Documents/Reports** - Formal documents
- **Presentations** - Slide content
- **Social Media** - LinkedIn, Twitter, etc.
- **Blog/Articles** - Long-form content

### Step 3: Communication Targets

Who are you writing to?
- **Customers/Clients** - External business communication
- **Internal Team** - Colleagues and peers
- **Executives/Leadership** - C-suite and management
- **Public/Social** - General audience
- **Partners/Vendors** - Business partners

### Step 4: Format

Do you communicate primarily through:
- **Text Only** - Written communication
- **Text + Voice** - Also use voice notes, meetings, calls

**Pro Tip**: Select "Text + Voice" to unlock audio transcription features.

---

## Adding Writing Samples

### Why Samples Matter

Your writing samples are the "golden corpus" - they're what the AI learns from. More samples = better Voice Twin.

### Minimum Requirements

- **Minimum**: 3 samples
- **Recommended**: 5-10 samples
- **Ideal**: 10-20 samples across different contexts

### Sample Types

Choose from:
- **Email (Formal)** - Business emails to clients/executives
- **Email (Casual)** - Informal emails to colleagues
- **Email (Internal)** - Team communications
- **Email (External)** - External correspondence
- **Slack Message** - Quick team chats
- **Report** - Formal documents
- **Presentation** - Slide content
- **Social Post** - LinkedIn, Twitter, etc.
- **Blog/Article** - Long-form content
- **Meeting Transcript** - Transcribed conversations
- **Voice Memo** - Transcribed voice notes

### Tips for Great Samples

1. **Be Authentic** - Use real writing, not edited versions
2. **Variety** - Include different contexts and audiences
3. **Length** - Mix short and long pieces
4. **Recent** - Use recent writing that reflects your current style
5. **Remove Sensitive Data** - Redact confidential information

### Adding a Sample

1. Go to Dashboard → Samples
2. Click "Add Sample"
3. Enter a title (e.g., "Client proposal email")
4. Select the sample type
5. Choose the language
6. (Optional) Add context and audience info
7. Paste or type your writing sample
8. Click "Save Sample"

---

## Generating Your Voice Twin

### When to Generate

Generate your Voice Twin after:
- Completing the Corpus Matrix questionnaire
- Adding at least 3 writing samples
- (Ideally) Adding 5-10 diverse samples

### Generation Process

1. Go to Dashboard → Generate
2. Review your corpus analysis (auto-generated)
3. Click "Generate Voice Twin"
4. Wait 30-60 seconds for AI processing
5. Review your generated Voice DNA and Master Prompt

### What You Get

- **Voice DNA** - Detailed analysis of your writing patterns
- **Master Prompt** - Ready-to-use prompt for AI platforms
- **Style Insights** - Key characteristics of your voice

### Regeneration

Need to update your Voice Twin?
- Add new samples and regenerate
- Regeneration limits depend on your tier:
  - **Starter**: 1 regeneration
  - **Pro**: 1 regeneration + subscription discount
  - **Executive**: 1 regeneration + included subscription
- Subscribers get unlimited regenerations

---

## Testing Your Voice Twin

### Using the Test UI

1. Go to Dashboard → Generate (after generating)
2. Scroll to "Test Your Voice Twin"
3. Enter a writing prompt (e.g., "Write an email about the project delay")
4. Select context: Email, Slack, Report, or Social
5. Click "Generate"

### Comparison Mode

Toggle "Compare with generic AI" to see:
- **With Twin**: Content written in your voice
- **Without Twin**: Generic AI response

This helps you see the difference your Voice Twin makes.

### Test Examples to Try

- "Write a thank you email to a client"
- "Draft a Slack message about being late"
- "Compose a LinkedIn post about industry trends"
- "Write feedback for a team member"

---

## Deploying to AI Platforms

### ChatGPT (Custom GPT)

1. Go to [chat.openai.com](https://chat.openai.com)
2. Click "Explore GPTs" → "Create"
3. Name your GPT (e.g., "My Writing Assistant")
4. Paste your Master Prompt into "Instructions"
5. Configure conversation starters
6. Save and start using

### Claude (Projects)

1. Go to [claude.ai](https://claude.ai)
2. Create a new Project
3. Click "Project Settings"
4. Paste your Master Prompt as "Project Instructions"
5. Start chatting in your voice

### Gemini (Gems)

1. Go to [gemini.google.com](https://gemini.google.com)
2. Click "Gems" → "New Gem"
3. Paste your Master Prompt in "Instructions"
4. Save and start using

### API Integration

Use your Master Prompt as the system message:

```javascript
// OpenAI
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: YOUR_MASTER_PROMPT },
    { role: 'user', content: 'Write an email...' }
  ]
});

// Anthropic
const response = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  system: YOUR_MASTER_PROMPT,
  messages: [{ role: 'user', content: 'Write an email...' }]
});
```

---

## Audio Transcription

### Overview

Turn voice recordings into writing samples with our transcription service.

### Supported Formats

MP3, MP4, WAV, WEBM, OGG, FLAC, M4A

### Pricing

| Duration | Price |
|----------|-------|
| Up to 15 minutes | $19 |
| 15-60 minutes | $29 |
| 1-3 hours | $49 |

### How to Use

1. Go to Dashboard → Samples
2. Click "Transcribe Audio"
3. Upload your audio file
4. See the estimated price
5. Complete payment
6. Receive transcription (usually < 5 minutes)
7. Transcription is auto-added as a sample

### Best Practices

- Use clear audio with minimal background noise
- Speaking naturally helps capture your authentic voice
- Meeting recordings work great for capturing your communication style

---

## Subscriptions & Updates

### Annual Subscription ($29/year)

Benefits:
- Unlimited regenerations
- Priority processing
- Version history
- Early access to new features

### How to Subscribe

1. Go to Dashboard → Deploy
2. Click "Subscribe for $29/year"
3. Complete checkout
4. Subscription starts immediately

### Managing Your Subscription

1. Go to Dashboard → Settings
2. View subscription status
3. Cancel anytime (access until period ends)

### Pro Tier First-Year Discount

Pro tier users get $10 off their first year of subscription ($19 instead of $29).

---

## Support

### Priority Support (Executive Tier)

Executive tier includes 30 days of priority support with:
- Faster response times (within 24 hours)
- Dedicated assistance
- Priority queue

### Creating a Support Ticket

1. Go to Dashboard → Support
2. Click "New Ticket"
3. Enter subject and description
4. Select priority level
5. Submit

### Standard Response Times

- **Priority Support**: Within 24 hours
- **Standard Support**: 48-72 hours

### Self-Service Resources

- This User Guide
- FAQ section (below)
- [API Documentation](/docs/API.md)

---

## FAQ

### Account & Access

**Q: I didn't receive the login email?**
A: Check your spam folder. If not there, try again with a different email or contact support.

**Q: Can I change my email address?**
A: Contact support to update your account email.

### Voice Twin

**Q: How many samples do I need?**
A: Minimum 3, but 5-10 samples give the best results.

**Q: Can I have multiple Voice Twins?**
A: Currently, each account has one Voice Twin. You can regenerate it anytime.

**Q: My Voice Twin doesn't sound like me. What should I do?**
A: Add more diverse samples, especially in the contexts where it doesn't match your style. Then regenerate.

**Q: Does my Voice Twin work in other languages?**
A: Yes! Add samples in each language you want to use.

### Billing

**Q: What payment methods do you accept?**
A: All major credit cards, Apple Pay, and Google Pay via Stripe.

**Q: Can I get a refund?**
A: Contact support within 7 days of purchase for refund requests.

**Q: Do discount codes work with subscriptions?**
A: Some discount codes apply to one-time purchases only. Check the code terms.

### Privacy & Security

**Q: Is my writing data secure?**
A: Yes. All data is encrypted, stored securely, and never shared.

**Q: Can I delete my data?**
A: Yes. Contact support to request complete data deletion.

**Q: Do you train AI models on my writing?**
A: No. Your samples are only used to create YOUR Voice Twin.

---

## Need More Help?

- **Support**: Dashboard → Support → New Ticket
- **Email**: support@myvoicetwin.io
- **Twitter**: @myvoicetwin

---

*Last updated: January 2026*
