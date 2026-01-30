# My Voice Twin - API Documentation

**Version**: 2.0.0
**Last Updated**: January 2026
**Base URL**: `https://myvoicetwin.io/api`

---

## Authentication

All authenticated endpoints require a valid Supabase session cookie. Users must be logged in via Supabase Auth.

---

## Endpoints

### Voice Profile Generation

#### POST `/api/generate-profile`

Generate a Voice DNA profile from questionnaire responses and writing samples.

**Authentication**: Required

**Request Body**: None (uses data from database)

**Response** (200):
```json
{
  "success": true,
  "profileId": "uuid",
  "masterPrompt": "...",
  "voiceDna": { ... },
  "tokensUsed": 15000,
  "regenerationsRemaining": 2
}
```

**Errors**:
- `401`: Unauthorized
- `400`: Insufficient samples (minimum 3 required)
- `403`: Regeneration limit reached (subscribers exempt)
- `404`: No questionnaire found

---

### Voice Testing

#### POST `/api/test-voice`

Test your voice profile by generating content in your voice.

**Authentication**: Required

**Request Body**:
```json
{
  "message": "Write an email about the project update",
  "context": "email|slack|report|social",
  "audience": "team|manager|client",
  "language": "en",
  "includeComparison": false
}
```

**Response** (200):
```json
{
  "withTwin": "Generated content in your voice...",
  "withoutTwin": "Generic AI content...",
  "tokensUsed": 150
}
```

**Errors**:
- `401`: Unauthorized
- `400`: Invalid context or missing message
- `404`: No active voice profile
- `429`: Rate limit exceeded (10/hour)

---

### Audio Transcription

#### POST `/api/transcribe`

Upload audio for transcription (paid add-on).

**Authentication**: Required

**Request**: `multipart/form-data`
- `file`: Audio file (MP3, MP4, WAV, WEBM, OGG, FLAC, M4A)
- `action`: `estimate` | `transcribe` (optional)
- `payment_token`: Upload ID after payment (optional)

**Response - Estimate** (200):
```json
{
  "tiers": [
    { "maxMinutes": 15, "priceCents": 1900, "priceFormatted": "$19", "label": "Up to 15 minutes" },
    { "maxMinutes": 60, "priceCents": 2900, "priceFormatted": "$29", "label": "15-60 minutes" },
    { "maxMinutes": 180, "priceCents": 4900, "priceFormatted": "$49", "label": "1-3 hours" }
  ]
}
```

**Response - Requires Payment** (200):
```json
{
  "requiresPayment": true,
  "uploadId": "uuid",
  "durationMinutes": 45,
  "priceCents": 2900,
  "priceFormatted": "$29",
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

**Response - Completed** (200):
```json
{
  "success": true,
  "uploadId": "uuid",
  "transcription": "Transcribed text...",
  "durationMinutes": 45,
  "wordCount": 3500
}
```

**Errors**:
- `401`: Unauthorized
- `400`: No file, unsupported format, file too large (>25MB), audio too long (>3hr)
- `500`: Transcription failed

#### GET `/api/transcribe`

Get transcription status or list all transcriptions.

**Authentication**: Required

**Query Parameters**:
- `id`: Specific upload ID (optional)

**Response - List** (200):
```json
{
  "uploads": [
    { "id": "uuid", "file_name": "recording.mp3", "status": "completed", ... }
  ]
}
```

**Response - Single** (200):
```json
{
  "upload": {
    "id": "uuid",
    "file_name": "recording.mp3",
    "status": "completed",
    "transcription": "...",
    "duration_seconds": 2700
  }
}
```

---

### Subscription Management

#### POST `/api/subscription`

Create a new $29/year subscription.

**Authentication**: Required

**Response** (200):
```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

**Errors**:
- `401`: Unauthorized
- `400`: Already has active subscription

#### GET `/api/subscription`

Get current subscription status.

**Authentication**: Required

**Response** (200):
```json
{
  "hasActiveSubscription": true,
  "subscription": {
    "id": "uuid",
    "status": "active",
    "currentPeriodEnd": "2027-01-30T00:00:00Z",
    "cancelAtPeriodEnd": false
  }
}
```

#### DELETE `/api/subscription`

Cancel subscription at period end.

**Authentication**: Required

**Response** (200):
```json
{
  "message": "Subscription will be canceled at the end of the billing period",
  "cancelAt": "2027-01-30T00:00:00Z"
}
```

**Errors**:
- `401`: Unauthorized
- `404`: No active subscription

---

### Checkout

#### POST `/api/checkout`

Create a Stripe checkout session for product purchase.

**Authentication**: Not required (email captured in checkout)

**Request Body**:
```json
{
  "product": "starter|pro|executive"
}
```

**Pricing Tiers**:
| Product | Price | Features |
|---------|-------|----------|
| starter | $49 | 1 language, 3 sections, 1 regeneration |
| pro | $99 | Unlimited languages/sections, 1 regen, subscription discount |
| executive | $249 | All Pro features + 1yr subscription + audio credits + 30-day support |

**Response** (200):
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**Notes**:
- Stripe Checkout supports promotion codes (enabled by default)
- Users can enter discount codes directly in the Stripe Checkout UI
- Metadata is passed to webhook for processing tier benefits

---

### Download

#### GET `/api/download`

Download purchased product files.

**Authentication**: Token-based

**Query Parameters**:
- `token`: Download token (UUID from purchase confirmation email)

**Response**: Binary file stream (ZIP)

**Headers**:
```
Content-Type: application/zip
Content-Disposition: attachment; filename="myvoicetwin-complete.zip"
```

**Errors**:
- `400`: Missing or invalid token
- `403`: Token expired, invalid, or download limit reached
- `500`: File not found

---

## Webhooks

### Stripe Webhook (Edge Function)

**URL**: `https://<project>.supabase.co/functions/v1/stripe-webhook`

**Events Handled**:
- `checkout.session.completed`: Creates purchase record
- `customer.subscription.created`: Creates subscription record
- `customer.subscription.updated`: Updates subscription status
- `customer.subscription.deleted`: Marks subscription canceled
- `invoice.payment_succeeded`: Updates subscription period
- `invoice.payment_failed`: Marks subscription as past_due

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/api/test-voice` | 10 requests/hour per user |
| `/api/generate-profile` | Based on purchase tier |
| `/api/transcribe` | Based on payment |

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Human-readable error message"
}
```

HTTP Status Codes:
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (no access/limit reached)
- `404`: Not Found
- `405`: Method Not Allowed
- `429`: Too Many Requests
- `500`: Internal Server Error

---

## Support Tickets

### GET `/api/support/tickets`

List all support tickets for the authenticated user.

**Authentication**: Required

**Response** (200):
```json
{
  "tickets": [
    {
      "id": "uuid",
      "subject": "Help with voice profile",
      "description": "...",
      "status": "open",
      "priority": "medium",
      "support_expires_at": "2026-03-01T00:00:00Z",
      "created_at": "2026-01-30T00:00:00Z"
    }
  ]
}
```

### POST `/api/support/tickets`

Create a new support ticket.

**Authentication**: Required

**Request Body**:
```json
{
  "subject": "Help with voice profile",
  "description": "Detailed description of the issue...",
  "priority": "low|medium|high|urgent"
}
```

**Response** (200):
```json
{
  "ticket": { ... },
  "has_priority_support": true,
  "support_expires_at": "2026-03-01T00:00:00Z"
}
```

**Notes**:
- Executive tier users get 30-day priority support
- Priority setting only applies to Executive tier

### GET `/api/support/tickets/[id]`

Get a specific ticket with all messages.

**Authentication**: Required

**Response** (200):
```json
{
  "ticket": { ... },
  "messages": [
    {
      "id": "uuid",
      "sender_type": "user|support",
      "message": "...",
      "created_at": "..."
    }
  ]
}
```

### PATCH `/api/support/tickets/[id]`

Update ticket status.

**Authentication**: Required

**Request Body**:
```json
{
  "status": "open|in_progress|resolved|closed"
}
```

### POST `/api/support/tickets/[id]/messages`

Add a reply to a ticket.

**Authentication**: Required

**Request Body**:
```json
{
  "message": "Reply text..."
}
```

**Notes**:
- Adding a reply to a resolved ticket reopens it
- Cannot add messages to closed tickets

---

## Discount Codes

### POST `/api/discount/validate`

Validate a discount code before checkout.

**Authentication**: Not required

**Request Body**:
```json
{
  "code": "LAUNCH10",
  "product": "executive",
  "amount_cents": 24900
}
```

**Response - Valid** (200):
```json
{
  "valid": true,
  "discount": {
    "code": "LAUNCH10",
    "description": "10% off - Launch promotion",
    "type": "percentage",
    "value": 10
  },
  "original_amount_cents": 24900,
  "discount_amount_cents": 2490,
  "final_amount_cents": 22410
}
```

**Response - Invalid** (200):
```json
{
  "valid": false,
  "error": "This discount code has expired"
}
```

**Notes**:
- Stripe promotion codes work automatically at checkout
- This endpoint validates custom referral/affiliate codes
- Discount types: `percentage` (10 = 10%) or `fixed` (cents)

---

## Corpus Analysis

### POST `/api/analyze-corpus`

Analyze writing samples to generate corpus insights.

**Authentication**: Required

**Request Body**: None (uses samples from database)

**Response** (200):
```json
{
  "analysis": {
    "totalSamples": 5,
    "totalWords": 2500,
    "avgWordsPerSample": 500,
    "sampleTypes": { "email_formal": 2, "slack_message": 3 },
    "languages": ["en"],
    "topPhrases": ["best regards", "quick update"],
    "toneIndicators": ["professional", "friendly"],
    "readabilityScore": 65
  }
}
```

---

## Email Automation

### POST `/api/email`

Send transactional emails (internal use).

**Authentication**: Service role (internal)

**Email Types**:
- `welcome`: New user signup
- `questionnaire_complete`: After questionnaire submission
- `samples_ready`: When 3+ samples added
- `purchase_confirmation`: After successful purchase
- `abandoned_cart`: Cart reminder (triggered by cron)
