// Test email configuration
// Run with: node test-email.js
// Or: npm run test-email

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEmail() {
  console.log('🧪 Testing Email Configuration...\n');

  // Check environment variables
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const emailTo = process.env.EMAIL_TO;

  console.log('Configuration Check:');
  console.log('✓ SMTP_HOST:', smtpHost || '❌ NOT SET');
  console.log('✓ SMTP_PORT:', smtpPort || '❌ NOT SET');
  console.log('✓ SMTP_USER:', smtpUser || '❌ NOT SET');
  console.log('✓ SMTP_PASS:', smtpPass ? '********' : '❌ NOT SET');
  console.log('✓ EMAIL_TO:', emailTo || '❌ NOT SET');
  console.log('');

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('❌ Email is not configured!');
    console.log('\n📝 Please follow these steps:');
    console.log('1. Copy .env.example to .env.local');
    console.log('2. Fill in your SMTP credentials');
    console.log('3. See EMAIL-SETUP.md for detailed instructions\n');
    process.exit(1);
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    // Verify connection
    console.log('🔌 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: `"IT Ticket System Test" <${smtpUser}>`,
      to: emailTo || smtpUser,
      subject: '✅ Test Email - IT Ticket System',
      text: `
🎫 IT Ticket System Email Test

This is a test email to verify your SMTP configuration is working correctly.

Configuration Details:
- SMTP Host: ${smtpHost}
- SMTP Port: ${smtpPort}
- Sender: ${smtpUser}
- Recipient: ${emailTo || smtpUser}
- Timestamp: ${new Date().toLocaleString()}

✅ If you received this email, your email notifications are configured correctly!

Next Steps:
1. Create a ticket in the system
2. Verify you receive email notifications
3. Test technician assignment emails

---
⚡ Automated message from IT Ticket System
      `.trim(),
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10b981; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .footer { background: #f3f4f6; padding: 15px; border-radius: 0 0 5px 5px; font-size: 12px; color: #6b7280; text-align: center; }
    .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; }
    .info { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 15px 0; }
    code { background: white; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">✅ Email Test Successful</h1>
    <p style="margin: 10px 0 0 0;">IT Ticket System</p>
  </div>
  <div class="content">
    <div class="success">
      <strong>🎉 Congratulations!</strong><br>
      Your SMTP configuration is working correctly. Email notifications are ready!
    </div>
    
    <h3>Configuration Details:</h3>
    <ul>
      <li><strong>SMTP Host:</strong> ${smtpHost}</li>
      <li><strong>SMTP Port:</strong> ${smtpPort}</li>
      <li><strong>Sender:</strong> ${smtpUser}</li>
      <li><strong>Recipient:</strong> ${emailTo || smtpUser}</li>
      <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
    </ul>

    <div class="info">
      <strong>📝 Next Steps:</strong>
      <ol>
        <li>Create a ticket in the system</li>
        <li>Verify you receive email notifications</li>
        <li>Test technician assignment emails</li>
      </ol>
    </div>
  </div>
  <div class="footer">
    ⚡ Automated test message from IT Ticket System
  </div>
</body>
</html>
      `.trim(),
    });

    console.log('✅ Test email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log(`📨 Email sent to: ${emailTo || smtpUser}\n`);
    console.log('🎉 Email configuration is working correctly!');
    console.log('💡 Check your inbox (and spam folder) for the test email.\n');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔍 Common issues:');
    console.log('- Gmail: Make sure you\'re using an App Password');
    console.log('- Check that your email and password are correct');
    console.log('- Verify your firewall isn\'t blocking port', smtpPort);
    console.log('- See EMAIL-SETUP.md for troubleshooting\n');
    process.exit(1);
  }
}

testEmail();
