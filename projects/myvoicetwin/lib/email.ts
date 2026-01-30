import { Resend } from 'resend'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Email sender configuration
const FROM_EMAIL = 'My Voice Twin <hello@myvoicetwin.io>'
const SUPPORT_EMAIL = 'support@myvoicetwin.io'

// Product display names
const PRODUCT_NAMES: Record<string, string> = {
  starter: 'Starter',
  complete: 'Complete',
  executive: 'Executive',
  'done-for-you': 'Done-For-You',
}

export interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

/**
 * Send welcome email after signup
 */
export async function sendWelcomeEmail(
  email: string,
  name?: string
): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to My Voice Twin - Let\'s Clone Your Voice!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7c3aed; margin: 0;">My Voice Twin</h1>
  </div>

  <h2 style="color: #1f2937;">Welcome${name ? `, ${name}` : ''}!</h2>

  <p>You've taken the first step toward having AI that actually sounds like you.</p>

  <p>Here's how to create your Voice Twin:</p>

  <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0;"><strong>Step 1:</strong> Complete the Voice Discovery Questionnaire</p>
    <p style="margin: 0 0 10px 0;"><strong>Step 2:</strong> Add 3-5 writing samples (emails, documents, messages)</p>
    <p style="margin: 0 0 10px 0;"><strong>Step 3:</strong> Generate your Voice DNA profile</p>
    <p style="margin: 0;"><strong>Step 4:</strong> Deploy to ChatGPT, Claude, or any AI</p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/questionnaire"
       style="background: linear-gradient(to right, #7c3aed, #ec4899); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
      Start Your Questionnaire
    </a>
  </div>

  <p style="color: #6b7280; font-size: 14px;">
    Questions? Reply to this email or contact us at ${SUPPORT_EMAIL}
  </p>

  <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p>&copy; ${new Date().getFullYear()} My Voice Twin. All rights reserved.</p>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Welcome email error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error('Welcome email exception:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Send questionnaire completion email
 */
export async function sendQuestionnaireCompleteEmail(
  email: string
): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Great Progress! Now Add Your Writing Samples',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7c3aed; margin: 0;">My Voice Twin</h1>
  </div>

  <h2 style="color: #1f2937;">Questionnaire Complete!</h2>

  <p>Excellent work! You've completed the Voice Discovery Questionnaire.</p>

  <p>Now it's time for the most important step: <strong>adding your writing samples</strong>.</p>

  <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0; font-weight: 600;">What makes great samples?</p>
    <ul style="margin: 0; padding-left: 20px;">
      <li>Emails you've written (formal and casual)</li>
      <li>Slack or Teams messages</li>
      <li>Reports or documents</li>
      <li>Social media posts</li>
      <li>Any writing that represents YOUR voice</li>
    </ul>
  </div>

  <p><strong>Tip:</strong> Add at least 3 samples across different contexts for best results.</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/samples"
       style="background: linear-gradient(to right, #7c3aed, #ec4899); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
      Add Writing Samples
    </a>
  </div>

  <p style="color: #6b7280; font-size: 14px;">
    Need help finding samples? Check your sent folder, Slack history, or any documents you've written.
  </p>

  <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p>&copy; ${new Date().getFullYear()} My Voice Twin. All rights reserved.</p>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Questionnaire email error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error('Questionnaire email exception:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Send "ready to generate" email when user has enough samples
 */
export async function sendReadyToGenerateEmail(
  email: string,
  sampleCount: number
): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'You\'re Ready to Generate Your Voice Twin!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7c3aed; margin: 0;">My Voice Twin</h1>
  </div>

  <h2 style="color: #1f2937;">You're Ready!</h2>

  <p>Congratulations! You've added <strong>${sampleCount} writing samples</strong> - that's enough to generate your Voice Twin!</p>

  <div style="background: linear-gradient(to right, #7c3aed, #ec4899); border-radius: 8px; padding: 20px; margin: 20px 0; color: white;">
    <p style="margin: 0; font-size: 18px; font-weight: 600;">What happens next?</p>
    <p style="margin: 10px 0 0 0;">Our AI will analyze your writing samples to extract your unique voice patterns - sentence rhythm, vocabulary choices, tone variations, and more.</p>
  </div>

  <p>The result? A Voice DNA profile that makes AI write exactly like you.</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/#pricing"
       style="background: linear-gradient(to right, #7c3aed, #ec4899); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
      Generate My Voice Twin - $99
    </a>
  </div>

  <p style="color: #6b7280; font-size: 14px;">
    14-day satisfaction guarantee. If it doesn't sound like you, get a full refund.
  </p>

  <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p>&copy; ${new Date().getFullYear()} My Voice Twin. All rights reserved.</p>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Ready email error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error('Ready email exception:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Send purchase confirmation email with download link
 */
export async function sendPurchaseConfirmationEmail(
  email: string,
  product: string,
  downloadToken: string
): Promise<SendEmailResult> {
  const productName = PRODUCT_NAMES[product] || product
  const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/download?token=${downloadToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your My Voice Twin ${productName} Package is Ready!`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7c3aed; margin: 0;">My Voice Twin</h1>
  </div>

  <div style="background: #10b981; color: white; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
    <h2 style="margin: 0;">Payment Confirmed!</h2>
  </div>

  <p>Thank you for your purchase! Your <strong>My Voice Twin ${productName}</strong> package is ready for download.</p>

  <div style="text-align: center; margin: 30px 0;">
    <a href="${downloadUrl}"
       style="background: linear-gradient(to right, #10b981, #059669); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 18px;">
      Download Your Files
    </a>
  </div>

  <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
    <p style="margin: 0; color: #92400e;">
      <strong>Important:</strong> Your download link expires in 7 days. You have 5 download attempts.
    </p>
  </div>

  <h3 style="color: #1f2937;">Getting Started</h3>
  <ol style="padding-left: 20px;">
    <li>Download and unzip your package</li>
    <li>Open <strong>00-START-HERE.pdf</strong></li>
    <li>Follow the step-by-step instructions</li>
    <li>Deploy your Voice Twin to any AI platform</li>
  </ol>

  <p style="color: #6b7280; font-size: 14px;">
    Questions? Contact us at ${SUPPORT_EMAIL} - we typically respond within 48 hours.
  </p>

  <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p>&copy; ${new Date().getFullYear()} My Voice Twin. All rights reserved.</p>
    <p>This is a receipt for your purchase.</p>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Purchase email error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error('Purchase email exception:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Send abandoned cart reminder (3 days)
 */
export async function sendAbandonedCartEmail(
  email: string,
  stage: 'questionnaire' | 'samples' | 'checkout'
): Promise<SendEmailResult> {
  const subjects: Record<string, string> = {
    questionnaire: 'Still working on your Voice Twin?',
    samples: 'Your Voice Twin is almost ready!',
    checkout: 'Complete your Voice Twin purchase',
  }

  const messages: Record<string, string> = {
    questionnaire: `
      <p>We noticed you started the Voice Discovery Questionnaire but haven't finished yet.</p>
      <p>It only takes about 5 minutes to complete, and it's the foundation for creating your Voice Twin.</p>
    `,
    samples: `
      <p>You're so close! You've completed the questionnaire, now just add a few writing samples.</p>
      <p>The more samples you add, the better your Voice Twin will capture your unique voice.</p>
    `,
    checkout: `
      <p>You've done the hard work - questionnaire done, samples added. Your Voice Twin is ready to be generated!</p>
      <p>Don't let all that effort go to waste.</p>
    `,
  }

  const ctas: Record<string, { text: string; url: string }> = {
    questionnaire: {
      text: 'Continue Questionnaire',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/questionnaire`,
    },
    samples: {
      text: 'Add Writing Samples',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/samples`,
    },
    checkout: {
      text: 'Complete Purchase - $99',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/#pricing`,
    },
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: subjects[stage],
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #7c3aed; margin: 0;">My Voice Twin</h1>
  </div>

  <h2 style="color: #1f2937;">${subjects[stage]}</h2>

  ${messages[stage]}

  <div style="text-align: center; margin: 30px 0;">
    <a href="${ctas[stage].url}"
       style="background: linear-gradient(to right, #7c3aed, #ec4899); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
      ${ctas[stage].text}
    </a>
  </div>

  <p style="color: #6b7280; font-size: 14px;">
    If you have any questions or need help, just reply to this email.
  </p>

  <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p>&copy; ${new Date().getFullYear()} My Voice Twin. All rights reserved.</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe" style="color: #9ca3af;">Unsubscribe</a></p>
  </div>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Abandoned cart email error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error('Abandoned cart email exception:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
