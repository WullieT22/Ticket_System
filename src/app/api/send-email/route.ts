// API Route for sending emails (server-side only)
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json()

    // Check if SMTP is configured
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('⚠️  SMTP not configured - email logged to console only')
      console.log('\n📧 EMAIL NOTIFICATION (Console Only)')
      console.log('To:', to)
      console.log('Subject:', subject)
      console.log('Body:', body)
      return NextResponse.json({ success: true, simulated: true })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const fromEmail = process.env.EMAIL_FROM || smtpUser

    // Send email
    const info = await transporter.sendMail({
      from: `"IT Ticket System" <${fromEmail}>`,
      to: to,
      subject: subject,
      text: body,
      html: convertToHtml(body),
    })

    console.log('✅ Email sent successfully!')
    console.log(`Message ID: ${info.messageId}`)

    return NextResponse.json({ success: true, messageId: info.messageId })
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

// Convert plain text to HTML
function convertToHtml(text: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 15px; border-radius: 5px 5px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .footer { background: #f3f4f6; padding: 10px; border-radius: 0 0 5px 5px; font-size: 12px; color: #6b7280; text-align: center; }
    pre { background: white; padding: 10px; border-radius: 3px; white-space: pre-wrap; word-wrap: break-word; }
  </style>
</head>
<body>
  <div class="header">
    <h2 style="margin: 0;">🎫 IT Ticket System</h2>
  </div>
  <div class="content">
    <pre>${text}</pre>
  </div>
  <div class="footer">
    ⚡ This is an automated notification from IT Ticket System
  </div>
</body>
</html>
  `.trim()
}
