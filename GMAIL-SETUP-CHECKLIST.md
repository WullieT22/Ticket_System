# ✅ Gmail Setup Checklist

Quick checklist for setting up Gmail for the IT Ticket System.

---

## 📧 Step 1: Create Gmail Account

**URL:** https://accounts.google.com/signup

- [ ] Opened Gmail signup page
- [ ] Entered first name: _________________
- [ ] Entered last name: _________________
- [ ] Tried username: `wt22` (or alternative: _________________)
- [ ] Created strong password
- [ ] Entered phone number for verification
- [ ] Verified phone with code
- [ ] Completed account creation

**✅ My Gmail address:** ________________________@gmail.com

---

## 🔐 Step 2: Enable 2-Step Verification

**URL:** https://myaccount.google.com/security

- [ ] Opened Google Account Security page
- [ ] Found "2-Step Verification" section
- [ ] Clicked "Get Started"
- [ ] Verified phone number
- [ ] Entered verification code
- [ ] Clicked "Turn On"
- [ ] 2-Step Verification is now ENABLED ✅

---

## 🔑 Step 3: Create App Password

**URL:** https://myaccount.google.com/apppasswords

- [ ] Opened App Passwords page
- [ ] Signed in again (if required)
- [ ] Selected "Mail" from dropdown
- [ ] Selected "Other (Custom name)"
- [ ] Typed: "IT Ticket System"
- [ ] Clicked "Generate"
- [ ] **Copied 16-character password:** ____ ____ ____ ____
- [ ] Saved password somewhere safe
- [ ] Clicked "Done"

**✅ My App Password:** ____ ____ ____ ____ (saved securely)

---

## 📝 Step 4: Update .env.local

**File:** `C:\Users\William.Turner\Documents\GitHub\Ticket_System\.env.local`

- [ ] Opened `.env.local` file
- [ ] Updated `SMTP_USER=` with my Gmail address
- [ ] Updated `SMTP_PASS=` with my App Password
- [ ] Updated `EMAIL_FROM=` with my Gmail address
- [ ] Verified `EMAIL_TO=william.turner@eolabs.com`
- [ ] Saved file

**Example:**
```env
SMTP_USER=wt22@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
EMAIL_FROM=wt22@gmail.com
EMAIL_TO=william.turner@eolabs.com
```

---

## 🧪 Step 5: Test Email

**Command:** `npm run test-email`

- [ ] Opened terminal/PowerShell
- [ ] Ran `npm run test-email`
- [ ] Saw: ✅ SMTP connection successful!
- [ ] Saw: ✅ Test email sent successfully!
- [ ] Checked `william.turner@eolabs.com` inbox
- [ ] Received test email ✅
- [ ] Email looks professional

**If test failed:**
- [ ] Checked App Password is correct
- [ ] Removed spaces from password
- [ ] Verified Gmail address is correct
- [ ] Read troubleshooting in GMAIL-SETUP-GUIDE.md

---

## 🚀 Step 6: Restart Dev Server

- [ ] Stopped dev server (Ctrl+C if running)
- [ ] Ran `npm run dev`
- [ ] Saw: ✅ Email transporter initialized successfully
- [ ] Server running at http://localhost:3000

---

## 🎫 Step 7: Test with Real Ticket

- [ ] Opened http://localhost:3000
- [ ] Logged in (department: _________________)
- [ ] Clicked "Request Support"
- [ ] Created test ticket
- [ ] Submitted ticket
- [ ] Checked console for: ✅ Email sent successfully!
- [ ] Checked `william.turner@eolabs.com` inbox
- [ ] Received ticket notification email ✅

---

## 🌐 Step 8: Prepare for Vercel (Later)

When deploying to Vercel, you'll use the same credentials:

- [ ] Have Gmail address ready: ________________________@gmail.com
- [ ] Have App Password saved: ____ ____ ____ ____
- [ ] Will add to Vercel environment variables
- [ ] See VERCEL-DEPLOYMENT.md for instructions

---

## ✅ Completion Status

**Gmail Setup:** ☐ Complete ☐ In Progress ☐ Not Started

**Email Testing:** ☐ Working ☐ Issues ☐ Not Tested

**Ready for Vercel:** ☐ Yes ☐ Need to complete above first

---

## 📋 My Information

**For future reference:**

| Item | Value |
|------|-------|
| Gmail Address | ________________________@gmail.com |
| App Password Location | ________________________ |
| Account Created | ___/___/2025 |
| 2-Step Enabled | ☐ Yes ☐ No |
| App Password Created | ☐ Yes ☐ No |
| Local Testing | ☐ Working ☐ Not Working |

---

## 🆘 Need Help?

- [ ] Read: GMAIL-SETUP-GUIDE.md (detailed instructions)
- [ ] Read: EMAIL-SETUP.md (troubleshooting)
- [ ] Check console for error messages
- [ ] Verify App Password is exactly 16 characters
- [ ] Try removing spaces from App Password
- [ ] Make sure 2-Step Verification is enabled

---

**Estimated Time:** 5-8 minutes total

**Date Completed:** _______________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

## 🎉 Success!

Once all checked:
- ✅ Gmail account created
- ✅ 2-Step Verification enabled
- ✅ App Password generated
- ✅ .env.local updated
- ✅ Test email successful
- ✅ Ticket notification working
- ✅ Ready for production!

**Your IT Ticket System now sends email notifications automatically!** 📧✨
