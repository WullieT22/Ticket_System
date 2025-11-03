# 📧 Gmail Setup Guide for IT Ticket System

## 🎯 Goal
Create a Gmail account with username `wt22` (or similar) to send ticket notifications.

---

## 📝 Step 1: Create Gmail Account

### Go to Gmail Signup:
**🔗 https://accounts.google.com/signup**

### Fill in the form:
1. **First name:** William (or your preference)
2. **Last name:** Turner (or your preference)
3. **Username:** Try these in order:
   - `wt22` ✨ (first choice)
   - `wt22.eolabs`
   - `wt22.tickets`
   - `wt22.itsupport`
   - `williamturner22`
   - `w.turner22`

4. **Password:** Create a strong password (you'll need this)
5. **Phone number:** Your phone (for verification)
6. **Recovery email:** Optional but recommended
7. **Birthday & Gender:** Fill as needed

### Complete verification:
- Enter phone verification code
- Agree to terms
- Click "Next"

**✅ Result:** You now have `wt22@gmail.com` (or similar)

---

## 🔐 Step 2: Enable 2-Step Verification

This is **REQUIRED** to get an App Password.

### Enable 2-Step Verification:
1. Go to: **https://myaccount.google.com/security**
2. Scroll to "How you sign in to Google"
3. Click **"2-Step Verification"**
4. Click **"Get Started"**
5. Follow the prompts:
   - Verify your phone number
   - Enter verification code
   - Click "Turn On"

**✅ Result:** 2-Step Verification is now enabled

---

## 🔑 Step 3: Create App Password

This is the password your IT Ticket System will use.

### Generate App Password:
1. Go to: **https://myaccount.google.com/apppasswords**
   - *Or: Google Account → Security → App passwords*
2. You may need to sign in again
3. Under "Select app" → Choose **"Mail"**
4. Under "Select device" → Choose **"Other (Custom name)"**
5. Type: **"IT Ticket System"**
6. Click **"Generate"**

### Copy the password:
- You'll see a **16-character password** like: `abcd efgh ijkl mnop`
- **Copy this exactly** (you can copy with spaces)
- Click **"Done"**

**⚠️ IMPORTANT:** Save this password - you won't see it again!

**✅ Result:** You have your App Password

---

## 📝 Step 4: Update .env.local

### Edit your `.env.local` file:

Replace these lines:
```env
SMTP_USER=wt22@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=wt22@gmail.com
```

With your actual details:
```env
SMTP_USER=wt22@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
EMAIL_FROM=wt22@gmail.com
```

*Replace `wt22@gmail.com` with your actual Gmail address*
*Replace `abcd efgh ijkl mnop` with your actual App Password*

**Note:** You can include or remove spaces in the password - both work.

---

## 🧪 Step 5: Test Email

### Run the test script:
```bash
npm run test-email
```

### Expected output:
```
✅ SMTP connection successful!
✅ Test email sent successfully!
📬 Message ID: <...>
```

### Check your inbox:
- Check `william.turner@eolabs.com`
- Look for test email from IT Ticket System
- Check spam folder if not in inbox

---

## 🚀 Step 6: Start Development Server

```bash
npm run dev
```

---

## ✅ Step 7: Test with Real Ticket

1. Go to: http://localhost:3000
2. Login (any department)
3. Create a test ticket
4. Check console for:
   ```
   ✅ Email sent successfully!
   ```
5. Check `william.turner@eolabs.com` inbox

---

## 🎉 Done!

Your Gmail account is set up and ready to send ticket notifications!

---

## 🔧 Troubleshooting

### "Username not available"
- Try: `wt22.eolabs`, `wt22.tickets`, `wt22.itsupport`
- Try: `williamturner22`, `w.turner22`
- Add numbers: `wt22.2024`, `wt22.dev`

### "Can't find App passwords option"
- Make sure 2-Step Verification is enabled first
- Sign out and sign back in
- Try direct link: https://myaccount.google.com/apppasswords

### "Authentication failed"
- Make sure you're using the App Password, not your regular password
- Copy the App Password exactly
- Try without spaces in the password

### "Less secure app access"
- Gmail no longer uses this - you MUST use App Passwords
- Regular password won't work

---

## 📋 Quick Reference

| What | Where |
|------|-------|
| Create Gmail | https://accounts.google.com/signup |
| Security Settings | https://myaccount.google.com/security |
| 2-Step Verification | https://myaccount.google.com/signinoptions/two-step-verification |
| App Passwords | https://myaccount.google.com/apppasswords |

---

## 🔄 Alternative: Use Work Email

If creating a Gmail is inconvenient, you can use your work email instead:

1. Ask your IT admin for SMTP server details
2. Update `.env.local` with work SMTP settings
3. May need: `mail.eolabs.com` or similar

---

## ⏱️ Time Required

- Gmail account creation: **2-3 minutes**
- 2-Step Verification: **1-2 minutes**
- App Password: **1 minute**
- Update .env.local: **1 minute**
- Testing: **1 minute**

**Total: ~5-8 minutes**

---

## 💡 Tips

- ✅ Use a strong password for your Gmail account
- ✅ Save the App Password somewhere secure
- ✅ Recovery email helps if you forget password
- ✅ You can create multiple App Passwords if needed
- ✅ Same Gmail can be used for local and Vercel

---

**Once complete, your IT Ticket System will automatically send email notifications!** 📧✨
