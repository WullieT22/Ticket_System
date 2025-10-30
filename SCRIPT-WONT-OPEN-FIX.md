# 🚨 Script Won't Open? - Complete Fix Guide

## 🎯 **Multiple Solutions - Pick What Works!**

The issue is that macOS treats `.sh` files as text files by default. Here are **4 guaranteed solutions**:

---

## 🏆 **Solution 1: Use .command file (RECOMMENDED)**

**File:** `Start IT Ticket System.command`  
**Action:** **Double-click** this file  
**Result:** Opens Terminal and runs automatically  
**Why it works:** macOS recognizes `.command` as executable

---

## 🛠️ **Solution 2: Use .tool file (NEW)**

**File:** `IT Ticket System.tool`  
**Action:** **Double-click** this file  
**Result:** Opens Terminal and runs automatically  
**Why it works:** Terminal recognizes `.tool` extension

---

## 🍎 **Solution 3: Use the App Bundle**

**File:** `IT Ticket System.app`  
**Action:** **Double-click** this file  
**Result:** Runs like a native Mac app  
**Note:** If this doesn't work, the app bundle may need permissions

---

## ⚙️ **Solution 4: Fix .sh Association**

### **Quick Fix:**
1. **Right-click** `start-with-browser.sh`
2. **Select** "Get Info"
3. **In "Open with:"** section, choose "Terminal"
4. **Click** "Change All..."
5. **Now double-click** the .sh file

### **Terminal Method:**
```bash
# Run this command to test:
open start-with-browser.sh -a Terminal
```

---

## 🧪 **Test Each Solution:**

### **Test 1: .command file**
```bash
# Should exist and be executable:
ls -la "Start IT Ticket System.command"
```

### **Test 2: .tool file**
```bash
# Should exist and be executable:
ls -la "IT Ticket System.tool"
```

### **Test 3: Direct Terminal run**
```bash
# This should always work:
./start-with-browser.sh
```

---

## 🔧 **If Nothing Works:**

### **Manual Terminal Method:**
1. **Open Terminal** (Applications → Utilities → Terminal)
2. **Type:** `cd ` (with space after cd)
3. **Drag** the `Ticket_System` folder into Terminal
4. **Press Enter**
5. **Type:** `./start-with-browser.sh`
6. **Press Enter**

### **Check Permissions:**
```bash
# Make sure all scripts are executable:
chmod +x *.sh *.command *.tool
```

---

## 💡 **Why This Happens:**

- **macOS Security:** Prevents random scripts from running
- **File Associations:** .sh files default to text editors
- **Solution:** Use file extensions macOS trusts (.command, .tool)

---

## 🎯 **Recommended Order to Try:**

1. **First:** Double-click `Start IT Ticket System.command`
2. **Second:** Double-click `IT Ticket System.tool`
3. **Third:** Fix .sh association and try `start-with-browser.sh`
4. **Last resort:** Manual Terminal method

---

## 🚀 **What Should Happen When Working:**

```
🎫 Starting IT Ticket System with Browser...
===============================================
✅ Node.js version: v25.1.0
✅ npm version: 11.6.2

🚀 Starting development server...
📍 The application will be available at: http://localhost:3000

⏳ Waiting for server to start...
✅ Server started successfully!
🌐 Opening browser...
```

---

## 📁 **Available Files:**

| File | Type | Recommended Use |
|------|------|----------------|
| `Start IT Ticket System.command` | Command Script | ⭐ **Best for double-click** |
| `IT Ticket System.tool` | Terminal Tool | ⭐ **Alternative double-click** |
| `start-with-browser.sh` | Shell Script | Manual or after fixing association |
| `IT Ticket System.app` | Mac App Bundle | Native app experience |

---

## 🆘 **Still Having Issues?**

1. **Check macOS Security Settings:**
   - System Preferences → Security & Privacy
   - Allow blocked items if any appear

2. **Try Different File:**
   - If one doesn't work, try another from the list above

3. **Update Permissions:**
   ```bash
   chmod +x "Start IT Ticket System.command"
   chmod +x "IT Ticket System.tool"
   ```

4. **Manual Launch:**
   - Open Terminal manually and run `./start-with-browser.sh`

---

**One of these solutions WILL work! Start with the .command file - it's the most reliable! 🎫✨**