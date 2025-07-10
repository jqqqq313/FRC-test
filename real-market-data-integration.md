# Real Market Data Integration Guide
## Replacing Fake Data with RentCast API

This guide shows how to replace the current simulated market data in your FRC Case Preparation Tool with real market data from RentCast API.

## Why RentCast API?

- **Comprehensive Coverage**: 140+ million properties across all 50 states
- **Connecticut Coverage**: Full coverage for CT Fair Rent Commission cases
- **Market Statistics**: Aggregate data by ZIP code perfect for market analysis
- **Rental Comparables**: Real comparable properties with addresses and rents
- **Affordable**: 50 free requests/month, $74/month for 1,000 requests
- **Recent Data**: Updated daily with 500k+ property updates

## Step 1: Get RentCast API Access

1. Visit [RentCast API](https://www.rentcast.io/api)
2. Sign up for a free account
3. Generate an API key from your dashboard
4. Start with the free Developer plan (50 requests/month)

## Step 2: Replace Fake Data Function

Replace the current `searchComparableRents()` function in your `index.html` with this real API integration:

```javascript
async function searchComparableRents() {
    const propertyType = document.getElementById('propertyType').value;
    const bedrooms = document.getElementById('bedrooms').value;
    const searchRadius = document.getElementById('searchRadius').value;
    
    if (!propertyType || !bedrooms) {
        alert('Please select property type and number of bedrooms');
        return;
    }

    // Get property location from form data
    const propertyAddress = document.getElementById('propertyAddress')?.value;
    if (!propertyAddress) {
        alert('Please enter the property address in the Case Information section first');
        return;
    }

    // Show loading state
    const button = event.target;
    button.textContent = '🔍 Searching Real Market Data...';
    button.disabled = true;

    try {
        // Get market data using RentCast API
        const marketData = await getRealMarketData(propertyAddress, propertyType, bedrooms, searchRadius);
        const comparables = await getRealComparables(propertyAddress, propertyType, bedrooms, searchRadius);
        
        // Process and display results
        displayRealMarketResults(marketData, comparables);
        
    } catch (error) {
        console.error('Error fetching real market data:', error);
        // Fallback to simulated data if API fails
        alert('Unable to fetch real market data. Please check your internet connection and try again.');
        fallbackToSimulatedData();
    } finally {
        button.textContent = '🔍 Find Comparable Properties';
        button.disabled = false;
    }
}

async function getRealMarketData(address, propertyType, bedrooms, radius) {
    const API_KEY = 'YOUR_RENTCAST_API_KEY'; // Replace with your actual API key
    
    // Extract ZIP code from address
    const zipCode = extractZipCode(address);
    
    const response = await fetch(`https://api.rentcast.io/v1/markets?zipCode=${zipCode}`, {
        headers: {
            'X-Api-Key': API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`Market data API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

async function getRealComparables(address, propertyType, bedrooms, radius) {
    const API_KEY = 'YOUR_RENTCAST_API_KEY'; // Replace with your actual API key
    
    // Map your property types to RentCast property types
    const propertyTypeMap = {
        'apartment': 'Apartment',
        'house': 'Single Family',
        'condo': 'Condo',
        'townhouse': 'Townhouse'
    };

    const response = await fetch(`https://api.rentcast.io/v1/listings/rental/long-term?address=${encodeURIComponent(address)}&radius=${radius}&propertyType=${propertyTypeMap[propertyType]}&bedrooms=${bedrooms}&limit=10`, {
        headers: {
            'X-Api-Key': API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`Comparables API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

function displayRealMarketResults(marketData, comparablesData) {
    const proposedRent = parseFloat(caseData.proposedRent) || 1200;
    
    // Calculate market comparison
    let marketRent = 0;
    let vsMarket = 0;
    
    if (marketData.rentalData) {
        marketRent = marketData.rentalData.averageRent;
        vsMarket = Math.round(((proposedRent - marketRent) / marketRent) * 100);
    }

    // Process comparable properties
    const comparables = comparablesData.map(comp => ({
        address: comp.addressLine1 || comp.address,
        rent: comp.rent,
        bedrooms: comp.bedrooms,
        distance: (comp.distance || 0).toFixed(1),
        squareFootage: comp.squareFootage,
        propertyType: comp.propertyType
    }));

    const resultsDiv = document.getElementById('marketAnalysisResults');
    const contentDiv = document.getElementById('marketAnalysisContent');

    contentDiv.innerHTML = `
        <div class="alert" style="background: ${vsMarket > 10 ? '#ffebee' : '#e8f5e8'}; border-color: ${vsMarket > 10 ? '#c62828' : '#4caf50'};">
            <strong>Real Market Analysis Conclusion:</strong> 
            The proposed rent appears to be <strong>${vsMarket > 10 ? 'significantly above market rate' : vsMarket > 0 ? 'above market rate' : 'consistent with market rates'}</strong> based on actual comparable properties.
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
                <h4>Market Summary</h4>
                <p><strong>Average Market Rent:</strong> $${Math.round(marketRent)}</p>
                <p><strong>Your Proposed Rent:</strong> $${proposedRent}</p>
                <p><strong>Market Difference:</strong> ${vsMarket > 0 ? '+' : ''}${vsMarket}%</p>
                <p><strong>ZIP Code:</strong> ${marketData.zipCode}</p>
            </div>
            <div>
                <h4>Data Source</h4>
                <p><strong>Provider:</strong> RentCast Real Estate API</p>
                <p><strong>Properties Found:</strong> ${comparables.length}</p>
                <p><strong>Search Radius:</strong> ${document.getElementById('searchRadius').value} miles</p>
                <p><strong>Last Updated:</strong> ${new Date(marketData.rentalData?.lastUpdatedDate).toLocaleDateString()}</p>
            </div>
        </div>

        ${vsMarket > 0 ? `
            <h4>Real Comparable Properties Supporting Your Case</h4>
            <p style="font-size: 14px; color: #666; margin-bottom: 15px;">Actual rental properties with lower rents that support your argument:</p>
            <div style="margin: 15px 0;">
                ${comparables.filter(prop => prop.rent < proposedRent).map(prop => `
                    <div class="document-item" style="margin: 8px 0;">
                        <div>
                            <strong>${prop.address}</strong>
                            <p>${prop.bedrooms} bedroom ${prop.propertyType} - ${prop.distance} miles away</p>
                            ${prop.squareFootage ? `<p style="font-size: 12px; color: #666;">${prop.squareFootage} sq ft</p>` : ''}
                        </div>
                        <div>
                            <strong style="color: #2e7d32;">$${prop.rent}/month</strong>
                            <p style="font-size: 12px; color: #666; margin: 0;">$${(proposedRent - prop.rent).toFixed(0)} less than proposed</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : `
            <h4>All Real Comparable Properties</h4>
            <div style="margin: 15px 0;">
                ${comparables.map(prop => `
                    <div class="document-item" style="margin: 8px 0;">
                        <div>
                            <strong>${prop.address}</strong>
                            <p>${prop.bedrooms} bedroom ${prop.propertyType} - ${prop.distance} miles away</p>
                            ${prop.squareFootage ? `<p style="font-size: 12px; color: #666;">${prop.squareFootage} sq ft</p>` : ''}
                        </div>
                        <div>
                            <strong style="color: ${prop.rent > proposedRent ? '#c62828' : '#2e7d32'};">$${prop.rent}/month</strong>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}

        <div class="alert" style="background: #e3f2fd; border-color: #2196f3;">
            <strong>Real Market Data Benefits:</strong><br>
            • Actual comparable properties with real addresses<br>
            • Current market rents from active listings<br>
            • Verifiable data from legitimate sources<br>
            • Stronger evidence for Fair Rent Commission hearings<br>
            • Professional credibility with real estate data
        </div>
    `;

    resultsDiv.style.display = 'block';
    
    // Update global market data
    currentMarketData = { 
        marketRent, 
        vsMarket, 
        propertyType: document.getElementById('propertyType').value, 
        bedrooms: document.getElementById('bedrooms').value, 
        comparables: comparables,
        dataSource: 'RentCast API',
        zipCode: marketData.zipCode
    };
    
    localStorage.setItem('frcCaseData', JSON.stringify({caseData, timelineEvents, documentsReady, currentMarketData}));
    updateProgress();
}

function extractZipCode(address) {
    // Extract ZIP code from address string
    const zipMatch = address.match(/\b\d{5}(-\d{4})?\b/);
    return zipMatch ? zipMatch[0].split('-')[0] : null;
}

function fallbackToSimulatedData() {
    // Keep your existing simulated data function as fallback
    // This ensures the tool still works if API is unavailable
    console.log('Falling back to simulated market data');
    // ... your existing fake data generation code ...
}
```

## Step 3: Add API Configuration

Add this configuration section to your HTML head:

```html
<script>
// RentCast API Configuration
const RENTCAST_CONFIG = {
    API_KEY: 'YOUR_API_KEY_HERE', // Replace with your actual API key
    BASE_URL: 'https://api.rentcast.io/v1',
    RATE_LIMIT: 50, // Free tier limit per month
    TIMEOUT: 10000 // 10 second timeout
};

// Track API usage to stay within limits
let apiCallsThisMonth = parseInt(localStorage.getItem('rentcastApiCalls') || '0');
const currentMonth = new Date().getMonth();
const lastApiMonth = parseInt(localStorage.getItem('lastApiMonth') || currentMonth);

// Reset counter if new month
if (currentMonth !== lastApiMonth) {
    apiCallsThisMonth = 0;
    localStorage.setItem('lastApiMonth', currentMonth.toString());
}

function checkApiLimit() {
    if (apiCallsThisMonth >= RENTCAST_CONFIG.RATE_LIMIT) {
        throw new Error('API limit reached for this month. Please upgrade your plan or wait for next month.');
    }
}

function incrementApiCalls() {
    apiCallsThisMonth++;
    localStorage.setItem('rentcastApiCalls', apiCallsThisMonth.toString());
}
</script>
```

## Step 4: Enhanced Error Handling

Add robust error handling for various scenarios:

```javascript
async function makeRentCastRequest(endpoint, params = {}) {
    try {
        checkApiLimit();
        
        const url = new URL(`${RENTCAST_CONFIG.BASE_URL}${endpoint}`);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), RENTCAST_CONFIG.TIMEOUT);

        const response = await fetch(url, {
            headers: {
                'X-Api-Key': RENTCAST_CONFIG.API_KEY,
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        incrementApiCalls();

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your RentCast API configuration.');
            } else if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please wait before making more requests.');
            } else if (response.status >= 500) {
                throw new Error('RentCast service temporarily unavailable. Please try again later.');
            }
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your internet connection.');
        }
        throw error;
    }
}
```

## Step 5: Add Usage Monitoring

Add a usage display to help users track their API consumption:

```javascript
function displayApiUsage() {
    const usageDisplay = document.createElement('div');
    usageDisplay.id = 'api-usage-display';
    usageDisplay.style.cssText = `
        position: fixed; 
        bottom: 20px; 
        right: 20px; 
        background: #f8f9fa; 
        border: 1px solid #dee2e6; 
        padding: 10px; 
        border-radius: 5px; 
        font-size: 12px; 
        z-index: 1000;
    `;
    
    const remainingCalls = RENTCAST_CONFIG.RATE_LIMIT - apiCallsThisMonth;
    usageDisplay.innerHTML = `
        <strong>RentCast API Usage</strong><br>
        Calls this month: ${apiCallsThisMonth}/${RENTCAST_CONFIG.RATE_LIMIT}<br>
        Remaining: ${remainingCalls}
    `;
    
    document.body.appendChild(usageDisplay);
}

// Add usage display when page loads
document.addEventListener('DOMContentLoaded', displayApiUsage);
```

## Step 6: Testing and Validation

1. **Test with Real Connecticut Addresses**:
   ```javascript
   // Test addresses for Connecticut
   const testAddresses = [
       "123 Main St, Hartford, CT 06103",
       "456 Elm Ave, New Haven, CT 06511", 
       "789 Park Dr, Stamford, CT 06901"
   ];
   ```

2. **Validate Data Quality**:
   - Ensure addresses are real and in Connecticut
   - Verify rent prices are reasonable for the area
   - Check that property types match your search criteria

3. **Compare with Local Knowledge**:
   - Cross-reference results with local rental market knowledge
   - Validate that the market analysis makes sense for Connecticut

## Benefits of Real Market Data

### For Legal Cases:
- **Credible Evidence**: Real addresses and verifiable rent data
- **Professional Presentation**: API-sourced data appears more legitimate
- **Stronger Arguments**: Actual market comparisons vs. simulated data
- **Verifiable Sources**: RentCast data can be independently verified

### For Users:
- **Accurate Analysis**: Real market conditions reflected in analysis
- **Current Data**: Updated daily vs. static fake data
- **Geographic Precision**: ZIP code level market statistics
- **Professional Reports**: Enhanced credibility in FRC filings

## Cost Management

### Free Tier Strategy (50 calls/month):
- Use market analysis sparingly for most important cases
- Cache results locally to avoid repeat API calls
- Implement smart fallback to simulated data when needed

### Paid Tier Benefits ($74/month for 1,000 calls):
- Unlimited practical usage for most organizations
- Real-time market analysis for all cases
- Enhanced data with more comparable properties
- Priority support from RentCast

## Next Steps

1. **Sign up for RentCast API** and get your API key
2. **Replace the fake data function** with the real API integration
3. **Test thoroughly** with Connecticut addresses
4. **Monitor usage** to stay within API limits
5. **Consider upgrading** to paid tier for unlimited usage

This integration transforms your FRC tool from using simulated data to leveraging real, current, and verifiable market data that will significantly strengthen Fair Rent Commission cases.