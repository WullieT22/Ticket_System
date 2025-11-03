# Email Setup Guide

## 📧 Enable Email Notifications

The IT Ticket System is configured to send email notifications but requires SMTP credentials to be set up.

---

## Quick Setup Steps

### 1️⃣ Copy Environment File
```bash
# Copy the example environment file
cp .env.example .env.local
```

### 2️⃣ Configure SMTP Settings

Edit `.env.local` and fill in your email credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here

EMAIL_FROM=your-email@gmail.com
EMAIL_TO=william.turner@eolabs.com
```

---

## 🔐 Gmail Setup (Recommended)

### Generate App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Go to **Security** → **App passwords**
4. Select **Mail** and **Other (Custom name)** → Enter "IT Ticket System"
5. Click **Generate**
6. Copy the 16-character password (remove spaces)
7. Use this password in `SMTP_PASS`

### Gmail Configuration
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
EMAIL_FROM=your-gmail@gmail.com
EMAIL_TO=william.turner@eolabs.com
```

---

## 📮 Other Email Providers

### Outlook / Office 365
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### Custom SMTP Server
```env
SMTP_HOST=mail.yourcompany.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
```

---

## 🧪 Testing Email

### 1. Restart the Development Server
After configuring `.env.local`, restart the server:

```bash
npm run dev
```

### 2. Create a Test Ticket
- Log in to the ticket system
- Create a new ticket
- Check the terminal/console for email logs
- Check your inbox for the notification

### 3. Check Console Output

**If SMTP is configured correctly:**
```
✅ Email transporter initialized successfully
📧 EMAIL NOTIFICATION
To: william.turner@eolabs.com
Subject: 🎫 New IT Ticket Created - TKT-12345
✅ Email sent successfully!
```

**If SMTP is NOT configured:**
```
⚠️  SMTP not configured - emails will be logged to console only
📝 To enable email sending:
   1. Copy .env.example to .env.local
   2. Fill in your SMTP credentials
```

---

## 🔍 Troubleshooting

### "SMTP not configured" message
- Make sure `.env.local` exists in the project root
- Check that `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` are all set
- Restart the development server after creating/editing `.env.local`

### "Authentication failed" error
- **Gmail**: Make sure you're using an App Password, not your regular password
- Verify 2-Step Verification is enabled for your Google account
- Check that the email and password are correct
- Try removing any spaces from the app password

### "Connection refused" error
- Check your firewall isn't blocking port 587
- Try port 465 with `SMTP_SECURE=true`
- Verify you have internet connectivity
- Some corporate networks block outgoing SMTP

### Emails not arriving
- Check your spam/junk folder
- Verify `EMAIL_TO` is set to the correct recipient email
- Check the console logs for "Email sent successfully" message
- Some email providers have daily sending limits

### Testing with a different service
If you're having trouble with Gmail, try using a dedicated email service:
- [Resend](https://resend.com) - Developer-friendly, free tier available
- [SendGrid](https://sendgrid.com) - Popular choice, free tier available
- [Mailgun](https://mailgun.com) - Good for transactional emails
- [Amazon SES](https://aws.amazon.com/ses/) - Cost-effective for high volume

---

## 🎯 What Gets Emailed

The system sends notifications for:

1. **New Ticket Created** ✉️
   - Sent when any user creates a new ticket
   - Includes ticket details, priority, department

2. **Technician Assigned** 👤
   - Sent when a technician is assigned to a ticket
   - Includes assignment details and ticket info

---

## 🔒 Security Notes

- **NEVER commit `.env.local` to Git** (already in `.gitignore`)
- Use App Passwords, not your main account password
- Keep your credentials secure
- Rotate passwords regularly
- Consider using environment-specific email accounts

---

## 📝 Next Steps

After setting up email:
1. ✅ Configure `.env.local` with your credentials
2. ✅ Restart the development server
3. ✅ Create a test ticket
4. ✅ Verify email arrives in inbox

Need help? Check the console output for detailed error messages!
