# ✅ Vercel Deployment Checklist

Use this checklist when deploying your IT Ticket System to Vercel with email support.

---

## 📋 Pre-Deployment (Local Setup)

- [ ] Email working locally (optional but recommended)
  - [ ] Edited `.env.local` with Gmail credentials
  - [ ] Got Gmail App Password from https://myaccount.google.com/apppasswords
  - [ ] Ran `npm run test-email` successfully
  - [ ] Received test email in inbox
  - [ ] Created test ticket and received notification

---

## 🚀 GitHub Upload

- [ ] All changes committed
  ```bash
  git add .
  git commit -m "Add email notification system"
  ```
- [ ] Pushed to GitHub
  ```bash
  git push origin main
  ```
- [ ] Verified `.env.local` was NOT uploaded (check GitHub repo)
- [ ] Verified `.env.example` WAS uploaded (should be visible on GitHub)

---

## 🌐 Vercel Deployment

- [ ] Logged into Vercel (https://vercel.com)
- [ ] Clicked "Add New Project"
- [ ] Imported GitHub repository: `WullieT22/Ticket_System`
- [ ] Vercel auto-detected Next.js settings
- [ ] **STOPPED BEFORE DEPLOYING** (need to add env variables first)

---

## 🔐 Environment Variables in Vercel

**Location:** Project → Settings → Environment Variables

### Add Each Variable:

- [ ] **SMTP_HOST**
  - Value: `smtp.gmail.com`
  - ☑️ Production ☑️ Preview ☑️ Development

- [ ] **SMTP_PORT**
  - Value: `587`
  - ☑️ Production ☑️ Preview ☑️ Development

- [ ] **SMTP_SECURE**
  - Value: `false`
  - ☑️ Production ☑️ Preview ☑️ Development

- [ ] **SMTP_USER**
  - Value: `your-email@gmail.com` (your actual email)
  - ☑️ Production ☑️ Preview ☑️ Development

- [ ] **SMTP_PASS**
  - Value: `your-16-char-app-password` (no spaces)
  - ☑️ Production ☑️ Preview ☑️ Development

- [ ] **EMAIL_FROM**
  - Value: `your-email@gmail.com` (same as SMTP_USER)
  - ☑️ Production ☑️ Preview ☑️ Development

- [ ] **EMAIL_TO**
  - Value: `william.turner@eolabs.com`
  - ☑️ Production ☑️ Preview ☑️ Development

**Total variables added:** ___/7

---

## 🔄 Deploy & Test

- [ ] Clicked "Deploy" or "Redeploy" in Vercel
- [ ] Deployment completed successfully
- [ ] Noted deployment URL: `https://_________________.vercel.app`

---

## 🧪 Testing on Live Site

- [ ] Visited Vercel deployment URL
- [ ] Site loads correctly
- [ ] Logged in successfully
- [ ] Created a test ticket
- [ ] Checked Vercel function logs for email confirmation
  - [ ] Saw: `✅ Email transporter initialized successfully`
  - [ ] Saw: `✅ Email sent successfully!`
- [ ] Checked `william.turner@eolabs.com` inbox
  - [ ] Received new ticket notification email
  - [ ] Email looks professional and complete
- [ ] Assigned technician to test ticket
- [ ] Received technician assignment email

---

## 🎯 Verification

- [ ] Dashboard displays correctly
- [ ] All departments work
- [ ] Ticket creation works
- [ ] Ticket updates work
- [ ] Email notifications send automatically
- [ ] No console errors
- [ ] Mobile responsive (optional: test on phone)

---

## 📝 Post-Deployment

- [ ] Saved Vercel URL for future reference
- [ ] Updated any documentation with live URL
- [ ] Notified team/users of new system
- [ ] Tested from multiple devices (optional)
- [ ] Verified all department logins work

---

## 🚨 If Something Goes Wrong

### Email Not Working:
- [ ] Checked all 7 environment variables are set in Vercel
- [ ] Verified all environments selected (Production, Preview, Development)
- [ ] Redeployed after adding variables
- [ ] Checked Vercel function logs for error messages
- [ ] Verified Gmail App Password is correct
- [ ] Checked spam folder

### Site Not Loading:
- [ ] Checked Vercel deployment status
- [ ] Reviewed build logs for errors
- [ ] Verified Next.js build succeeded
- [ ] Checked browser console for errors

### Need Help:
- [ ] Read [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md)
- [ ] Read [EMAIL-SETUP.md](EMAIL-SETUP.md) troubleshooting section
- [ ] Check Vercel function logs
- [ ] Review GitHub Actions (if set up)

---

## ✅ Deployment Complete!

Once all items are checked:
- ✅ Your IT Ticket System is live on Vercel
- ✅ Email notifications are working
- ✅ All features are operational
- ✅ william.turner@eolabs.com receives notifications
- ✅ System is ready for production use

---

**Deployment Date:** _______________

**Vercel URL:** https://_________________________________.vercel.app

**Email Status:** ☐ Working ☐ Not Yet Configured

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

🎉 **Congratulations! Your IT Ticket System is live!** 🎉
