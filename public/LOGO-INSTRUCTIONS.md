# How to Add Your Company Logo

## Steps:

1. **Prepare your logo:**
   - Save your logo as `logo.png`
   - Recommended size: 200-400px wide, transparent background works best
   - Supported formats: .png, .jpg, .svg

2. **Add the logo file:**
   - Copy your logo file to: `public/logo.png`
   - The file MUST be named exactly `logo.png` (or update the code if you want a different name)

3. **The logo will appear:**
   - In the top left corner of the dashboard header
   - Height: 40px (width auto-scales)
   - If the logo file doesn't exist, it will be hidden automatically

## To change the logo size:

Edit `src/app/dashboard/layout.tsx` and change the `h-10` class:
- `h-8` = smaller (32px)
- `h-10` = default (40px)
- `h-12` = larger (48px)

## Current location:
Your logo should be placed at:
```
Ticket_System/
  public/
    logo.png  <-- Put your logo here
```
