# 🔐 Secure API Key Setup Guide

## Why API Key Security Matters

**Never share your API key with anyone** - including me! API keys are like passwords and should be kept secure. Here's how to implement real market data while keeping your API key safe.

## 🚀 Complete Secure Setup (15 minutes)

### Step 1: Get Your RentCast API Key (5 minutes)

1. Visit [RentCast API](https://www.rentcast.io/api)
2. Click "Start for Free"
3. Sign up with your email
4. Generate your API key
5. **Copy it to a secure notepad** (you'll need it in Step 3)

### Step 2: Set Up Security Files (5 minutes)

1. **Create `config.js` file** in your project root:
   ```javascript
   // config.js - This file should NEVER be committed to version control
   const API_CONFIG = {
       RENTCAST_API_KEY: 'YOUR_ACTUAL_API_KEY_HERE', // Replace with your real key
       DEBUG_MODE: false,
       USE_REAL_API: true
   };
   
   window.API_CONFIG = API_CONFIG;
   ```

2. **Update your `.gitignore`** file to include:
   ```
   # Security - Never commit API keys
   config.js
   .env
   *api-key*
   *secret*
   ```

3. **Add the secure config to your HTML** (add this line in the `<head>` section):
   ```html
   <script src="config.js"></script>
   ```

### Step 3: Replace Your Market Data Function (5 minutes)

1. **Backup your current function** (save it in a comment just in case)

2. **Replace your `searchComparableRents()` function** with the code from `secure-rentcast-integration.js`

3. **Add your API key to `config.js`**:
   ```javascript
   // Replace 'YOUR_ACTUAL_API_KEY_HERE' with your real API key from Step 1
   RENTCAST_API_KEY: 'rck_live_1234567890abcdef...',  // Your actual key here
   ```

### Step 4: Load Files in Correct Order

Update your HTML to load files in this order:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Load config FIRST - before any other scripts -->
    <script src="config.js"></script>
    
    <!-- Other head content -->
    <title>FRC Case Preparation Tool</title>
    <!-- ... your existing head content ... -->
</head>
<body>
    <!-- Your existing body content -->
    
    <!-- Load the secure integration script AFTER config.js -->
    <script src="secure-rentcast-integration.js"></script>
    
    <!-- OR if you prefer to embed it directly: -->
    <script>
        // Paste the secure integration code here
    </script>
</body>
</html>
```

## 🔒 Security Features Included

### ✅ What's Protected:
- **API key never appears in logs** - automatically redacted
- **Separate config file** - easy to keep secure
- **Not committed to git** - .gitignore prevents accidental sharing
- **Fallback to demo mode** - works even without API key
- **Usage tracking** - prevents going over free tier limits
- **Secure validation** - checks if API key is properly configured

### ✅ Visual Security Indicators:
- **🔒 Secure** indicator when API key is configured
- **⚠️ Demo Mode** warning when using simulated data
- **API usage tracker** shows remaining calls
- **Professional "Secure Connection ✅ Verified"** in reports

## 🎯 Testing Your Setup

1. **Test without API key** (should show demo mode):
   - Don't add your API key yet
   - Try the market analysis
   - Should see "⚠️ Demo Mode" warnings

2. **Test with API key** (should show real data):
   - Add your real API key to `config.js`
   - Try with a Connecticut address like "123 Main St, Hartford, CT 06103"
   - Should see "🔒 Secure" indicator and real addresses

## 📁 File Structure

```
your-project/
├── index.html                     # Your main FRC tool
├── config.js                      # 🔒 SECURE - Contains your API key
├── secure-rentcast-integration.js # The secure API integration
├── .gitignore                     # Prevents config.js from being committed
└── README.md                      # Your project documentation
```

## 🛡️ Best Practices

### ✅ DO:
- Keep `config.js` on your local machine only
- Add `config.js` to `.gitignore`
- Use different API keys for development vs production
- Monitor your API usage with the built-in tracker
- Test with demo mode first

### ❌ DON'T:
- Share your API key with anyone
- Commit `config.js` to version control
- Email or message your API key
- Put API keys directly in your main code files
- Share screenshots that show your API key

## 🔧 Troubleshooting

### "API_CONFIG not found" error?
- Make sure `config.js` is loaded BEFORE the integration script
- Check that the file path is correct
- Verify `config.js` exists in your project root

### Still seeing "Demo Mode"?
- Check that your API key is correctly pasted in `config.js`
- Make sure there are no extra spaces or quotes
- Verify the API key starts with `rck_` (RentCast keys)

### API calls not working?
- Test with a Connecticut ZIP code (06103, 06511, etc.)
- Check browser console for error messages
- Ensure your RentCast account is active

## 🔄 Updating Your API Key

If you need to change your API key:

1. Get new API key from RentCast dashboard
2. Update `config.js` with new key
3. Test to ensure it's working
4. **Never commit the updated file to git**

## 💡 Advanced Security (Optional)

For even more security, you can:

1. **Use environment variables** (server-side only)
2. **Encrypt the config file** for storage
3. **Use a separate config directory** (`config/api-keys.js`)
4. **Implement key rotation** for production systems

## 🎉 You're All Set!

Once configured, you'll have:
- **Real market data** instead of fake addresses
- **Professional reports** with verifiable sources
- **Secure API key management** that never gets exposed
- **Visual indicators** showing security status
- **Automatic fallback** if anything goes wrong

Your FRC Case Preparation Tool is now professional-grade with real market data while keeping your API credentials completely secure!