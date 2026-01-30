# My Voice Twin - API Documentation

**Version**: 1.0.0
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
  "priceId": "price_xxx",
  "email": "user@example.com"
}
```

**Pricing Tiers**:
| Product | Price | Regenerations |
|---------|-------|---------------|
| starter | $49 | 1 |
| complete | $99 | 3 |
| executive | $249 | 5 |
| done-for-you | $499 | Unlimited |

**Response** (200):
```json
{
  "url": "https://checkout.stripe.com/...",
  "sessionId": "cs_xxx"
}
```

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
