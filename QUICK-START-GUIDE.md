# Quick Start: Real Market Data Integration

## 🚀 Get Real Market Data in 15 Minutes

This guide shows how to quickly replace your fake market data with real RentCast API data.

## Step 1: Get Your Free API Key (5 minutes)

1. Go to [RentCast API](https://www.rentcast.io/api)
2. Click "Start for Free" 
3. Sign up with email
4. Generate API key from dashboard
5. Copy your API key

## Step 2: Replace Your Function (5 minutes)

1. **Backup your current function** (optional but recommended):
   ```javascript
   // Save your current searchComparableRents() function in a comment
   ```

2. **Replace the entire `searchComparableRents()` function** in your `index.html` with the code from `rentcast-api-integration.js`

3. **Update the API key** on line 4:
   ```javascript
   API_KEY: 'YOUR_ACTUAL_API_KEY_HERE', // Replace with key from Step 1
   ```

## Step 3: Test It (5 minutes)

1. Open your FRC tool
2. Enter a Connecticut property address (e.g., "123 Main St, Hartford, CT 06103")
3. Fill in property type and bedrooms
4. Click "Find Comparable Properties"
5. See real market data appear!

## Key Benefits You'll See Immediately

✅ **Real Addresses**: Actual street addresses instead of "123 Oak St"  
✅ **Current Rents**: Real rental prices from active listings  
✅ **Verifiable Data**: Professional source that can be independently verified  
✅ **ZIP Code Analysis**: Market statistics for the specific area  
✅ **Legal Credibility**: Significantly stronger evidence for FRC hearings  

## Free Tier Limits

- **50 API calls per month** - Perfect for testing and light usage
- **Automatic tracking** - Visual display shows remaining calls
- **Smart fallback** - Uses simulated data if limit reached

## Example Before/After

### Before (Fake Data):
```
123 Oak St - $1,400/month (2 bedroom apartment, 1.2 miles away)
456 Main St - $1,350/month (2 bedroom apartment, 0.8 miles away)
```

### After (Real Data):
```
📍 45 Woodland Street - 💰 $1,425/month (🛏️ 2 bedroom Apartment • 📍 0.3 miles away)
📍 123 Garden Street - 💰 $1,350/month (🛏️ 2 bedroom Apartment • 📍 0.7 miles away)
```

## Cost Analysis

### Free Tier (50 calls/month):
- **Perfect for**: Testing, demo, occasional use
- **Estimated usage**: 2-3 FRC cases per month
- **Cost**: $0

### Paid Tier ($74/month for 1,000 calls):
- **Perfect for**: Regular FRC case preparation
- **Estimated usage**: Unlimited practical use
- **Cost per case**: ~$2.50 (if 30 cases/month)
- **ROI**: Professional credibility worth far more than cost

## Troubleshooting

### "API key not configured" message?
- Replace `YOUR_RENTCAST_API_KEY` with your actual API key
- Make sure there are no extra spaces or quotes

### "No market data available for ZIP code"?
- Check that property address includes a valid CT ZIP code
- Try nearby ZIP codes if rural area

### "API limit reached"?
- Tool automatically falls back to simulated data
- Resets monthly, or upgrade to paid tier

## Support

- **RentCast Support**: Live chat at rentcast.io
- **API Documentation**: [developers.rentcast.io](https://developers.rentcast.io)
- **Your Integration**: Check console for error messages

## What Happens Next?

1. **Stronger FRC Cases**: Real market data significantly improves case strength
2. **Professional Presentation**: API-sourced data appears more credible
3. **Verifiable Evidence**: Fair Rent Commission can independently verify data
4. **Time Savings**: No more manual comparable property research

## Upgrade When Ready

Consider upgrading to the paid tier when:
- Processing more than 50 cases per month
- Need unlimited market analysis capability
- Want priority support from RentCast

**This integration transforms your tool from a demo to a professional-grade legal resource for Connecticut Fair Rent Commission cases.**