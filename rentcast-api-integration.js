// RentCast API Integration for FRC Case Preparation Tool
// Replace your existing searchComparableRents() function with this implementation

// Configuration - Replace with your actual API key
const RENTCAST_CONFIG = {
    API_KEY: 'YOUR_RENTCAST_API_KEY', // Get from https://www.rentcast.io/api
    BASE_URL: 'https://api.rentcast.io/v1',
    RATE_LIMIT: 50, // Free tier limit per month
    TIMEOUT: 15000 // 15 second timeout for API calls
};

// Track API usage to stay within free tier limits
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
        throw new Error('API limit reached for this month. Please upgrade your RentCast plan or wait for next month.');
    }
}

function incrementApiCalls() {
    apiCallsThisMonth++;
    localStorage.setItem('rentcastApiCalls', apiCallsThisMonth.toString());
    updateApiUsageDisplay();
}

// Enhanced searchComparableRents function with real API integration
async function searchComparableRents() {
    const propertyType = document.getElementById('propertyType').value;
    const bedrooms = document.getElementById('bedrooms').value;
    const searchRadius = document.getElementById('searchRadius').value;
    
    if (!propertyType || !bedrooms) {
        alert('Please select property type and number of bedrooms');
        return;
    }

    // Get property address from case data
    const propertyAddress = caseData.propertyAddress || document.getElementById('propertyAddress')?.value;
    if (!propertyAddress) {
        alert('Please enter the property address in the Case Information section first');
        return;
    }

    // Show loading state
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '🔍 Searching Real Market Data...';
    button.disabled = true;

    try {
        // Check if we should use real API or fallback to simulated data
        if (RENTCAST_CONFIG.API_KEY === 'YOUR_RENTCAST_API_KEY' || !RENTCAST_CONFIG.API_KEY) {
            console.log('API key not configured, using simulated data');
            throw new Error('API_KEY_NOT_CONFIGURED');
        }

        // Get real market data
        const zipCode = extractZipCode(propertyAddress);
        if (!zipCode) {
            throw new Error('Could not extract ZIP code from property address');
        }

        const [marketData, comparablesData] = await Promise.all([
            getRealMarketData(zipCode),
            getRealComparables(propertyAddress, propertyType, bedrooms, searchRadius)
        ]);
        
        // Display real market results
        displayRealMarketResults(marketData, comparablesData, propertyAddress);
        
        // Update usage display
        updateApiUsageDisplay();
        
    } catch (error) {
        console.error('Error fetching real market data:', error);
        
        if (error.message === 'API_KEY_NOT_CONFIGURED') {
            alert('RentCast API key not configured. Using simulated data for demo purposes.\n\nTo use real market data:\n1. Sign up at rentcast.io/api\n2. Replace YOUR_RENTCAST_API_KEY with your actual API key');
        } else if (error.message.includes('API limit reached')) {
            alert(error.message + '\n\nFalling back to simulated data.');
        } else {
            alert('Unable to fetch real market data: ' + error.message + '\n\nFalling back to simulated data.');
        }
        
        // Fallback to existing simulated data
        fallbackToSimulatedData();
        
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

async function getRealMarketData(zipCode) {
    checkApiLimit();
    
    const response = await fetch(`${RENTCAST_CONFIG.BASE_URL}/markets?zipCode=${zipCode}`, {
        headers: {
            'X-Api-Key': RENTCAST_CONFIG.API_KEY
        },
        signal: AbortSignal.timeout(RENTCAST_CONFIG.TIMEOUT)
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Invalid RentCast API key');
        } else if (response.status === 429) {
            throw new Error('API rate limit exceeded');
        } else if (response.status === 404) {
            throw new Error(`No market data available for ZIP code ${zipCode}`);
        }
        throw new Error(`Market data API error: ${response.status}`);
    }

    const data = await response.json();
    incrementApiCalls();
    return data;
}

async function getRealComparables(address, propertyType, bedrooms, radius) {
    checkApiLimit();
    
    // Map property types to RentCast format
    const propertyTypeMap = {
        'apartment': 'Apartment',
        'house': 'Single Family',
        'condo': 'Condo',
        'townhouse': 'Townhouse'
    };

    const rentcastPropertyType = propertyTypeMap[propertyType] || 'Single Family';
    
    const params = new URLSearchParams({
        address: address,
        radius: radius,
        propertyType: rentcastPropertyType,
        bedrooms: bedrooms,
        limit: '10'
    });

    const response = await fetch(`${RENTCAST_CONFIG.BASE_URL}/listings/rental/long-term?${params}`, {
        headers: {
            'X-Api-Key': RENTCAST_CONFIG.API_KEY
        },
        signal: AbortSignal.timeout(RENTCAST_CONFIG.TIMEOUT)
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Invalid RentCast API key');
        } else if (response.status === 429) {
            throw new Error('API rate limit exceeded');
        }
        throw new Error(`Comparables API error: ${response.status}`);
    }

    const data = await response.json();
    incrementApiCalls();
    return data;
}

function displayRealMarketResults(marketData, comparablesData, searchAddress) {
    const proposedRent = parseFloat(caseData.proposedRent) || 1200;
    
    // Calculate market comparison
    let marketRent = 0;
    let vsMarket = 0;
    
    if (marketData.rentalData) {
        marketRent = marketData.rentalData.averageRent || 0;
        if (marketRent > 0) {
            vsMarket = Math.round(((proposedRent - marketRent) / marketRent) * 100);
        }
    }

    // Process comparable properties
    const comparables = (comparablesData || []).map(comp => ({
        address: comp.addressLine1 || comp.address || 'Address not available',
        rent: comp.rent || 0,
        bedrooms: comp.bedrooms || 0,
        distance: comp.distance ? comp.distance.toFixed(1) : '0.0',
        squareFootage: comp.squareFootage,
        propertyType: comp.propertyType || 'Unknown'
    })).filter(comp => comp.rent > 0); // Filter out properties without rent data

    const resultsDiv = document.getElementById('marketAnalysisResults');
    const contentDiv = document.getElementById('marketAnalysisContent');

    const dataQualityNote = comparables.length === 0 ? 
        '<div class="alert" style="background: #fff3e0; border-color: #ff9800;"><strong>Note:</strong> Limited comparable rental data available for this area. Consider expanding search radius or checking nearby ZIP codes.</div>' : '';

    contentDiv.innerHTML = `
        <div class="alert" style="background: ${vsMarket > 10 ? '#ffebee' : '#e8f5e8'}; border-color: ${vsMarket > 10 ? '#c62828' : '#4caf50'};">
            <strong>✅ Real Market Analysis Conclusion:</strong> 
            The proposed rent appears to be <strong>${vsMarket > 10 ? 'significantly above market rate' : vsMarket > 0 ? 'above market rate' : 'consistent with market rates'}</strong> based on actual comparable properties in ${marketData.zipCode}.
        </div>
        
        ${dataQualityNote}
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
                <h4>📊 Market Summary</h4>
                <p><strong>Average Market Rent:</strong> $${Math.round(marketRent).toLocaleString()}</p>
                <p><strong>Your Proposed Rent:</strong> $${proposedRent.toLocaleString()}</p>
                <p><strong>Market Difference:</strong> ${vsMarket > 0 ? '+' : ''}${vsMarket}%</p>
                <p><strong>ZIP Code:</strong> ${marketData.zipCode}</p>
            </div>
            <div>
                <h4>🔗 Data Source</h4>
                <p><strong>Provider:</strong> RentCast Real Estate API</p>
                <p><strong>Properties Found:</strong> ${comparables.length}</p>
                <p><strong>Search Radius:</strong> ${document.getElementById('searchRadius').value} miles</p>
                <p><strong>Last Updated:</strong> ${new Date(marketData.rentalData?.lastUpdatedDate || Date.now()).toLocaleDateString()}</p>
            </div>
        </div>

        ${comparables.length > 0 ? `
            <h4>🏠 ${vsMarket > 0 ? 'Comparable Properties Supporting Your Case' : 'All Comparable Properties'}</h4>
            ${vsMarket > 0 ? '<p style="font-size: 14px; color: #666; margin-bottom: 15px;">✅ Actual rental properties with lower rents that support your argument:</p>' : ''}
            <div style="margin: 15px 0;">
                ${(vsMarket > 0 ? comparables.filter(prop => prop.rent < proposedRent) : comparables).map(prop => `
                    <div class="document-item" style="margin: 8px 0; border-left: 3px solid #2e7d32;">
                        <div>
                            <strong>📍 ${prop.address}</strong>
                            <p>🛏️ ${prop.bedrooms} bedroom ${prop.propertyType} • 📍 ${prop.distance} miles away</p>
                            ${prop.squareFootage ? `<p style="font-size: 12px; color: #666;">📐 ${prop.squareFootage.toLocaleString()} sq ft</p>` : ''}
                        </div>
                        <div>
                            <strong style="color: ${prop.rent > proposedRent ? '#c62828' : '#2e7d32'};">💰 $${prop.rent.toLocaleString()}/month</strong>
                            ${vsMarket > 0 && prop.rent < proposedRent ? `<p style="font-size: 12px; color: #666; margin: 0;">💵 $${(proposedRent - prop.rent).toLocaleString()} less than proposed</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : `
            <div class="alert" style="background: #f5f5f5; border-color: #ccc;">
                <strong>Limited Comparable Data:</strong><br>
                • No comparable rental listings found in the immediate area<br>
                • Try expanding the search radius<br>
                • Market analysis based on ZIP code averages: ${marketData.zipCode}<br>
                • Consider manual research for additional comparables
            </div>
        `}

        <div class="alert" style="background: #e3f2fd; border-color: #2196f3;">
            <strong>✨ Real Market Data Advantages:</strong><br>
            • 📋 Verifiable addresses and rent amounts<br>
            • 📅 Current market data updated daily<br>
            • 🏛️ Professional credibility for FRC hearings<br>
            • 📊 ZIP code level market statistics<br>
            • 🔍 Independently verifiable through RentCast<br>
            • ⚖️ Stronger legal evidence than simulated data
        </div>
    `;

    resultsDiv.style.display = 'block';
    
    // Update global market data with real API source
    currentMarketData = { 
        marketRent, 
        vsMarket, 
        propertyType: document.getElementById('propertyType').value, 
        bedrooms: document.getElementById('bedrooms').value, 
        comparables: comparables,
        dataSource: 'RentCast Real Estate API',
        zipCode: marketData.zipCode,
        searchAddress: searchAddress,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('frcCaseData', JSON.stringify({caseData, timelineEvents, documentsReady, currentMarketData}));
    updateProgress();
}

function extractZipCode(address) {
    // Enhanced ZIP code extraction
    const zipMatch = address.match(/\b(\d{5})(-\d{4})?\b/);
    return zipMatch ? zipMatch[1] : null;
}

function fallbackToSimulatedData() {
    // Your existing simulated data function
    console.log('Using simulated market data as fallback');
    
    const propertyType = document.getElementById('propertyType').value;
    const bedrooms = document.getElementById('bedrooms').value;
    const searchRadius = document.getElementById('searchRadius').value;
    
    const baseRent = parseFloat(caseData.currentRent) || 1200;
    const marketRent = baseRent * (0.85 + Math.random() * 0.3);
    const proposedRent = parseFloat(caseData.proposedRent) || baseRent * 1.2;
    const vsMarket = Math.round(((proposedRent - marketRent) / marketRent) * 100);

    // Generate simulated comparable properties
    const comparables = [];
    for (let i = 0; i < 5; i++) {
        const variation = (Math.random() - 0.5) * 0.2;
        comparables.push({
            address: `${Math.floor(Math.random() * 999) + 1} ${['Oak St', 'Main St', 'Elm Ave', 'Park Dr', 'Church St'][i]}`,
            rent: Math.round(marketRent * (1 + variation)),
            bedrooms: parseInt(bedrooms) + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0),
            distance: (Math.random() * parseFloat(searchRadius)).toFixed(1)
        });
    }

    // Display simulated results with warning
    const resultsDiv = document.getElementById('marketAnalysisResults');
    const contentDiv = document.getElementById('marketAnalysisContent');

    contentDiv.innerHTML = `
        <div class="alert" style="background: #fff3e0; border-color: #ff9800;">
            <strong>⚠️ Demo Mode - Simulated Data:</strong> 
            Using simulated market data for demonstration. For real FRC cases, configure RentCast API for actual market data.
        </div>
        
        <div class="alert" style="background: ${vsMarket > 10 ? '#ffebee' : '#e8f5e8'}; border-color: ${vsMarket > 10 ? '#c62828' : '#4caf50'};">
            <strong>Market Analysis Conclusion:</strong> 
            The proposed rent appears to be <strong>${vsMarket > 10 ? 'significantly above market rate' : vsMarket > 0 ? 'above market rate' : 'consistent with market rates'}</strong> based on comparable properties.
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
                <h4>Market Summary</h4>
                <p><strong>Average Market Rent:</strong> $${Math.round(marketRent)}</p>
                <p><strong>Your Proposed Rent:</strong> $${proposedRent}</p>
                <p><strong>Market Difference:</strong> ${vsMarket > 0 ? '+' : ''}${vsMarket}%</p>
                <p><strong>Property Type:</strong> ${propertyType}</p>
            </div>
            <div>
                <h4>Search Parameters</h4>
                <p><strong>Bedrooms:</strong> ${bedrooms === '0' ? 'Studio' : bedrooms + ' bedroom(s)'}</p>
                <p><strong>Search Area:</strong> ${searchRadius} mile radius</p>
                <p><strong>Properties Found:</strong> ${comparables.length}</p>
                <p><strong>Data Source:</strong> Simulated for demo</p>
            </div>
        </div>

        <h4>Simulated Comparable Properties</h4>
        <div style="margin: 15px 0;">
            ${comparables.map(prop => `
                <div class="document-item" style="margin: 8px 0;">
                    <div>
                        <strong>${prop.address}</strong>
                        <p>${prop.bedrooms === 0 ? 'Studio' : prop.bedrooms + ' bedroom'} ${propertyType} - ${prop.distance} miles away</p>
                    </div>
                    <div>
                        <strong style="color: ${prop.rent > proposedRent ? '#c62828' : '#2e7d32'};">$${prop.rent}/month</strong>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    resultsDiv.style.display = 'block';
    currentMarketData = { marketRent, vsMarket, propertyType, bedrooms, comparables, dataSource: 'Simulated Demo Data' };
    localStorage.setItem('frcCaseData', JSON.stringify({caseData, timelineEvents, documentsReady, currentMarketData}));
    updateProgress();
}

// Add API usage tracking display
function updateApiUsageDisplay() {
    let usageDisplay = document.getElementById('api-usage-display');
    if (!usageDisplay) {
        usageDisplay = document.createElement('div');
        usageDisplay.id = 'api-usage-display';
        usageDisplay.style.cssText = `
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            background: #f8f9fa; 
            border: 1px solid #dee2e6; 
            padding: 10px 15px; 
            border-radius: 8px; 
            font-size: 12px; 
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 200px;
        `;
        document.body.appendChild(usageDisplay);
    }
    
    const remainingCalls = RENTCAST_CONFIG.RATE_LIMIT - apiCallsThisMonth;
    const percentage = (apiCallsThisMonth / RENTCAST_CONFIG.RATE_LIMIT) * 100;
    
    usageDisplay.innerHTML = `
        <div style="font-weight: bold; color: #333;">🏠 RentCast API Usage</div>
        <div style="margin: 5px 0; font-size: 11px;">
            ${apiCallsThisMonth}/${RENTCAST_CONFIG.RATE_LIMIT} calls this month
        </div>
        <div style="background: #e9ecef; height: 4px; border-radius: 2px; margin: 5px 0;">
            <div style="background: ${percentage > 80 ? '#dc3545' : percentage > 60 ? '#ffc107' : '#28a745'}; height: 100%; width: ${percentage}%; border-radius: 2px;"></div>
        </div>
        <div style="font-size: 10px; color: ${remainingCalls < 10 ? '#dc3545' : '#666'};">
            ${remainingCalls} calls remaining
        </div>
    `;
}

// Initialize API usage display when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateApiUsageDisplay();
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        searchComparableRents,
        getRealMarketData,
        getRealComparables,
        extractZipCode,
        RENTCAST_CONFIG
    };
}