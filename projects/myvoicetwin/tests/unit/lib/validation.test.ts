import { describe, it, expect } from 'vitest'

// Validation helper functions that we'll test
// These could be extracted from the API routes

const VALID_CONTEXTS = ['email', 'slack', 'report', 'social'] as const
const VALID_SAMPLE_TYPES = [
  'email_formal', 'email_casual', 'email_internal', 'email_external',
  'slack_message', 'report', 'presentation', 'social_post',
  'blog_article', 'meeting_transcript', 'voice_memo', 'other'
] as const
const VALID_FORMALITY_LEVELS = ['very_formal', 'formal', 'neutral', 'casual', 'very_casual'] as const

// Validation functions
function isValidContext(context: string): boolean {
  return VALID_CONTEXTS.includes(context as any)
}

function isValidSampleType(type: string): boolean {
  return VALID_SAMPLE_TYPES.includes(type as any)
}

function isValidFormalityLevel(level: string): boolean {
  return VALID_FORMALITY_LEVELS.includes(level as any)
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidLanguageCode(code: string): boolean {
  // ISO 639-1 two-letter codes
  const validCodes = ['en', 'es', 'fr', 'de', 'ja', 'ko', 'zh', 'pt', 'it', 'ru', 'ar', 'hi']
  return validCodes.includes(code.toLowerCase())
}

describe('Validation Utilities', () => {
  describe('isValidContext', () => {
    it('accepts valid contexts', () => {
      expect(isValidContext('email')).toBe(true)
      expect(isValidContext('slack')).toBe(true)
      expect(isValidContext('report')).toBe(true)
      expect(isValidContext('social')).toBe(true)
    })

    it('rejects invalid contexts', () => {
      expect(isValidContext('invalid')).toBe(false)
      expect(isValidContext('')).toBe(false)
      expect(isValidContext('EMAIL')).toBe(false) // Case sensitive
    })
  })

  describe('isValidSampleType', () => {
    it('accepts valid sample types', () => {
      expect(isValidSampleType('email_formal')).toBe(true)
      expect(isValidSampleType('slack_message')).toBe(true)
      expect(isValidSampleType('report')).toBe(true)
      expect(isValidSampleType('social_post')).toBe(true)
      expect(isValidSampleType('other')).toBe(true)
    })

    it('rejects invalid sample types', () => {
      expect(isValidSampleType('invalid')).toBe(false)
      expect(isValidSampleType('EMAIL_FORMAL')).toBe(false)
      expect(isValidSampleType('')).toBe(false)
    })
  })

  describe('isValidFormalityLevel', () => {
    it('accepts valid formality levels', () => {
      expect(isValidFormalityLevel('very_formal')).toBe(true)
      expect(isValidFormalityLevel('formal')).toBe(true)
      expect(isValidFormalityLevel('neutral')).toBe(true)
      expect(isValidFormalityLevel('casual')).toBe(true)
      expect(isValidFormalityLevel('very_casual')).toBe(true)
    })

    it('rejects invalid formality levels', () => {
      expect(isValidFormalityLevel('invalid')).toBe(false)
      expect(isValidFormalityLevel('FORMAL')).toBe(false)
      expect(isValidFormalityLevel('')).toBe(false)
    })
  })

  describe('isValidUUID', () => {
    it('accepts valid UUIDs', () => {
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
      expect(isValidUUID('AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE')).toBe(true) // Uppercase
    })

    it('rejects invalid UUIDs', () => {
      expect(isValidUUID('')).toBe(false)
      expect(isValidUUID('not-a-uuid')).toBe(false)
      expect(isValidUUID('123e4567-e89b-12d3-a456')).toBe(false) // Too short
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000-extra')).toBe(false) // Too long
      expect(isValidUUID('123e4567e89b12d3a456426614174000')).toBe(false) // No hyphens
    })
  })

  describe('isValidEmail', () => {
    it('accepts valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.com')).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('not-an-email')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('test@.com')).toBe(false)
    })
  })

  describe('isValidLanguageCode', () => {
    it('accepts valid language codes', () => {
      expect(isValidLanguageCode('en')).toBe(true)
      expect(isValidLanguageCode('ja')).toBe(true)
      expect(isValidLanguageCode('fr')).toBe(true)
      expect(isValidLanguageCode('EN')).toBe(true) // Case insensitive
    })

    it('rejects invalid language codes', () => {
      expect(isValidLanguageCode('')).toBe(false)
      expect(isValidLanguageCode('english')).toBe(false)
      expect(isValidLanguageCode('xx')).toBe(false)
    })
  })
})

describe('Test Voice Request Validation', () => {
  interface TestVoiceRequest {
    message: string
    context: string
    audience?: string
    language?: string
    includeComparison: boolean
  }

  function validateTestVoiceRequest(body: Partial<TestVoiceRequest>): { valid: boolean; error?: string } {
    if (!body.message || typeof body.message !== 'string') {
      return { valid: false, error: 'Message is required and must be a string.' }
    }

    if (!body.context || !isValidContext(body.context)) {
      return { valid: false, error: 'Context is required and must be one of: email, slack, report, social.' }
    }

    if (typeof body.includeComparison !== 'boolean') {
      return { valid: false, error: 'includeComparison is required and must be a boolean.' }
    }

    if (body.language && !isValidLanguageCode(body.language)) {
      return { valid: false, error: 'Invalid language code.' }
    }

    return { valid: true }
  }

  it('validates complete valid request', () => {
    const request = {
      message: 'Write an email to my team',
      context: 'email',
      includeComparison: true,
      language: 'en',
    }
    expect(validateTestVoiceRequest(request)).toEqual({ valid: true })
  })

  it('validates request without optional fields', () => {
    const request = {
      message: 'Write an email',
      context: 'email',
      includeComparison: false,
    }
    expect(validateTestVoiceRequest(request)).toEqual({ valid: true })
  })

  it('rejects request without message', () => {
    const request = {
      context: 'email',
      includeComparison: false,
    }
    const result = validateTestVoiceRequest(request)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Message')
  })

  it('rejects request with empty message', () => {
    const request = {
      message: '',
      context: 'email',
      includeComparison: false,
    }
    const result = validateTestVoiceRequest(request)
    expect(result.valid).toBe(false)
  })

  it('rejects request with invalid context', () => {
    const request = {
      message: 'Test',
      context: 'invalid',
      includeComparison: false,
    }
    const result = validateTestVoiceRequest(request)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Context')
  })

  it('rejects request without includeComparison', () => {
    const request = {
      message: 'Test',
      context: 'email',
    }
    const result = validateTestVoiceRequest(request)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('includeComparison')
  })
})
