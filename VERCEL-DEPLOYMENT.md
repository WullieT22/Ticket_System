# 🚀 Vercel Deployment Guide with Email Support

## ✅ YES - Email Will Work on Vercel!

Your email system **will work on Vercel** once you configure the environment variables in your Vercel project settings.

---

## 📋 Pre-Deployment Checklist

### ✅ Already Done (Automatic)
- ✅ `.env.local` is in `.gitignore` (won't be uploaded to GitHub)
- ✅ `.env.example` will be pushed (safe template)
- ✅ Nodemailer is in `dependencies` (will be installed on Vercel)
- ✅ Next.js configuration is Vercel-ready

### ⚠️ You Need To Do
- ⚠️ Configure environment variables in Vercel dashboard
- ⚠️ Test email after deployment

---

## 🚀 Step-by-Step Deployment

### Step 1: Push to GitHub

```bash
# Make sure you're in the project directory
cd C:\Users\William.Turner\Documents\GitHub\Ticket_System

# Add all files
git add .

# Commit changes
git commit -m "Add email notification system with Nodemailer"

# Push to GitHub
git push origin main
```

**Note**: Your `.env.local` file will NOT be uploaded (it's in `.gitignore` for security).

---

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to **https://vercel.com**
2. Click **"Add New Project"**
3. Import your GitHub repository: `WullieT22/Ticket_System`
4. Vercel will auto-detect Next.js settings
5. **WAIT** - Don't click Deploy yet!

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project directory
vercel
```

---

### Step 3: Configure Environment Variables in Vercel

**🔥 CRITICAL STEP - Email won't work without this!**

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in the sidebar
4. Add each variable one by one:

| Key | Value | Environment |
|-----|-------|-------------|
| `SMTP_HOST` | `smtp.gmail.com` | Production, Preview, Development |
| `SMTP_PORT` | `587` | Production, Preview, Development |
| `SMTP_SECURE` | `false` | Production, Preview, Development |
| `SMTP_USER` | `your-email@gmail.com` | Production, Preview, Development |
| `SMTP_PASS` | `your-app-password` | Production, Preview, Development |
| `EMAIL_FROM` | `your-email@gmail.com` | Production, Preview, Development |
| `EMAIL_TO` | `william.turner@eolabs.com` | Production, Preview, Development |

**Important Notes:**
- ✅ Select all three environments: **Production**, **Preview**, and **Development**
- 🔒 Use your Gmail **App Password**, not your regular password
- 💡 Copy exactly from your `.env.local` file
- ⚠️ No quotes needed around values in Vercel

---

### Step 4: Redeploy

After adding environment variables:

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Click **"Redeploy"** button
4. **OR** just push another commit to GitHub (auto-deploys)

---

## 🧪 Testing on Vercel

### After Deployment:

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Login as admin or any department
3. Create a test ticket
4. Check `william.turner@eolabs.com` inbox for email

### Check Vercel Logs:

1. In Vercel Dashboard → Your Project
2. Click **"Functions"** or **"Logs"** tab
3. Look for email logs:
   ```
   ✅ Email transporter initialized successfully
   📧 EMAIL NOTIFICATION
   ✅ Email sent successfully!
   ```

---

## 🔍 Vercel-Specific Considerations

### ✅ What Works on Vercel:
- ✅ Nodemailer SMTP (what we're using)
- ✅ Gmail SMTP
- ✅ Outlook/Office365 SMTP
- ✅ Custom SMTP servers
- ✅ Environment variables
- ✅ Server-side email sending

### ⚠️ What to Know:
- Emails sent from **server-side** code only (API routes, Server Components)
- Vercel functions have **10-second timeout** on Hobby plan (our emails send in <1 second)
- **No cold start issues** - Nodemailer is fast
- Environment variables are **encrypted** and secure

---

## 🔒 Security Best Practices

### What's Protected:
✅ `.env.local` is NOT in Git (in `.gitignore`)
✅ Vercel environment variables are **encrypted**
✅ Only you can see the values in Vercel dashboard
✅ Not exposed to client-side code
✅ App Password used instead of main password

### What to Avoid:
❌ Don't commit `.env.local` to Git
❌ Don't share screenshots of Vercel environment variables
❌ Don't use your main Gmail password
❌ Don't expose env vars in client components

---

## 📊 Deployment Checklist

Use this checklist for your deployment:

- [ ] Local email working (test with `npm run test-email`)
- [ ] `.env.local` has correct credentials
- [ ] `.gitignore` includes `.env*.local`
- [ ] Code committed to Git
- [ ] Pushed to GitHub
- [ ] Vercel project created
- [ ] All 7 environment variables added in Vercel
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed after adding env vars
- [ ] Tested ticket creation on live site
- [ ] Confirmed email received in inbox

---

## 🚨 Troubleshooting on Vercel

### Issue: "SMTP not configured" in Vercel logs
**Solution:**
- Check all 7 environment variables are set in Vercel
- Make sure you selected all environments
- Redeploy after adding variables
- Variables are case-sensitive

### Issue: Emails work locally but not on Vercel
**Solution:**
- Verify environment variables in Vercel Settings
- Check Vercel function logs for error messages
- Make sure you redeployed after adding env vars
- Try redeploying with "Clear Cache" option

### Issue: "Authentication failed" on Vercel
**Solution:**
- Double-check `SMTP_USER` and `SMTP_PASS` in Vercel
- Use Gmail App Password, not regular password
- Copy-paste from `.env.local` to avoid typos
- No quotes around values in Vercel

### Issue: Can't find environment variables section
**Solution:**
- Go to your project in Vercel
- Click "Settings" tab (top)
- Click "Environment Variables" in left sidebar
- If missing, make sure you're the project owner

---

## 🎯 Quick Reference: Environment Variables

Copy these from your `.env.local` to Vercel:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=william.turner@eolabs.com
```

**Where to add them:** Vercel Dashboard → Project → Settings → Environment Variables

---

## 🔗 Useful Vercel Links

- **Dashboard**: https://vercel.com/dashboard
- **Environment Variables Docs**: https://vercel.com/docs/projects/environment-variables
- **Deployment Docs**: https://vercel.com/docs/deployments/overview
- **Function Logs**: https://vercel.com/docs/observability/runtime-logs

---

## 📞 Alternative: Use Vercel-Specific Email Service

If you have issues with Gmail SMTP on Vercel, consider these alternatives:

### Option 1: Resend (Recommended for Vercel)
```bash
npm install resend
```
- Free tier: 100 emails/day
- Vercel partnership - works perfectly
- Simpler setup than SMTP

### Option 2: SendGrid
- Free tier: 100 emails/day
- Popular choice
- Simple API

### Option 3: Continue with Gmail
- Works great on Vercel
- No extra cost
- Just need environment variables set

---

## ✅ Summary

**Will email work on Vercel?** 
# YES! ✅

**What you need to do:**
1. ✅ Add 7 environment variables in Vercel Settings
2. ✅ Use your Gmail App Password (same as local)
3. ✅ Redeploy after adding variables
4. ✅ Test with a ticket creation

**Everything else is already configured and ready!** 🚀

---

## 🎉 After Successful Deployment

Once deployed and tested:
- ✅ Emails will automatically send on every ticket creation
- ✅ Emails will send when technicians are assigned
- ✅ william.turner@eolabs.com will receive all notifications
- ✅ Works identically to local development
- ✅ No code changes needed

**Your IT Ticket System will be fully functional with email notifications on Vercel!** 📧✨
