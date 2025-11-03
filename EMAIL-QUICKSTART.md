# 📧 Email Quick Start

## ⚡ Fast Setup (3 minutes)

### Step 1: Configure Email
1. Edit `.env.local` file (already created for you)
2. Add your Gmail credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=william.turner@eolabs.com
```

### Step 2: Get Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification (if not already enabled)
3. Create App Password for "IT Ticket System"
4. Copy the 16-character password (remove spaces)
5. Paste into `SMTP_PASS` in `.env.local`

### Step 3: Test Email
```bash
npm run test-email
```

### Step 4: Restart Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## ✅ What You'll See

**If working:**
```
✅ Email transporter initialized successfully
✅ Test email sent successfully!
📬 Message ID: <...>
```

**If not configured:**
```
⚠️  SMTP not configured - emails will be logged to console only
```

---

## 🔥 Troubleshooting

### Gmail "Less secure app" error
→ Use an **App Password**, not your regular password
→ https://myaccount.google.com/apppasswords

### Authentication failed
→ Check email and password are correct
→ Remove spaces from app password
→ Make sure 2-Step Verification is enabled

### No .env.local file?
→ Already created at: `c:\Users\William.Turner\Documents\GitHub\Ticket_System\.env.local`
→ Just edit it with your credentials

---

## 📖 Full Documentation
See [EMAIL-SETUP.md](EMAIL-SETUP.md) for complete instructions
