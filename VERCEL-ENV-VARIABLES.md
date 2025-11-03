# ⚡ Quick Vercel Setup - Environment Variables

## 🎯 Copy These to Vercel

After deploying to Vercel, add these 7 environment variables:

---

### 📋 Variable 1: SMTP_HOST
```
Key:   SMTP_HOST
Value: smtp.gmail.com
```
☑️ Production ☑️ Preview ☑️ Development

---

### 📋 Variable 2: SMTP_PORT
```
Key:   SMTP_PORT
Value: 587
```
☑️ Production ☑️ Preview ☑️ Development

---

### 📋 Variable 3: SMTP_SECURE
```
Key:   SMTP_SECURE
Value: false
```
☑️ Production ☑️ Preview ☑️ Development

---

### 📋 Variable 4: SMTP_USER
```
Key:   SMTP_USER
Value: your-email@gmail.com
```
☑️ Production ☑️ Preview ☑️ Development
*(Replace with your actual Gmail address)*

---

### 📋 Variable 5: SMTP_PASS
```
Key:   SMTP_PASS
Value: your-16-character-app-password
```
☑️ Production ☑️ Preview ☑️ Development
*(Use Gmail App Password from https://myaccount.google.com/apppasswords)*

---

### 📋 Variable 6: EMAIL_FROM
```
Key:   EMAIL_FROM
Value: your-email@gmail.com
```
☑️ Production ☑️ Preview ☑️ Development
*(Same as SMTP_USER)*

---

### 📋 Variable 7: EMAIL_TO
```
Key:   EMAIL_TO
Value: william.turner@eolabs.com
```
☑️ Production ☑️ Preview ☑️ Development

---

## 🔍 Where to Add These

1. Go to: **https://vercel.com/dashboard**
2. Click your **Ticket_System** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in sidebar
5. Click **"Add New"** button
6. Enter each Key and Value
7. Select all 3 environments
8. Click **"Save"**
9. Repeat for all 7 variables

---

## ⚠️ Important Notes

- **No quotes** around values in Vercel
- **Case-sensitive** - copy exactly as shown
- **Check all 3 boxes** for each variable (Production, Preview, Development)
- **Redeploy** after adding all variables

---

## ✅ After Adding Variables

1. Go to **"Deployments"** tab
2. Click latest deployment
3. Click **"Redeploy"** button
4. Wait for deployment to complete
5. Test by creating a ticket on your live site

---

## 🎉 Done!

Your email notifications will work on Vercel! 📧
