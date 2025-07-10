// FRC Case Prep Tool - Main Application Logic
// Connecticut Fair Rent Commission Case Preparation Tool

// Global variables for application state
let caseData = {};
let timelineEvents = [];
let documentsReady = {};
let currentMarketData = null;

// Case Information Functions
function saveBasics() {
    caseData.tenantName = document.getElementById('tenantName').value;
    caseData.propertyAddress = document.getElementById('propertyAddress').value;
    caseData.landlordName = document.getElementById('landlordName').value;
    caseData.currentRent = document.getElementById('currentRent').value;
    caseData.proposedRent = document.getElementById('proposedRent').value;
    caseData.rentIncreaseDate = document.getElementById('rentIncreaseDate').value;
    caseData.caseType = document.getElementById('caseType').value;
    caseData.caseSummary = document.getElementById('caseSummary').value;
    
    localStorage.setItem('frcCaseData', JSON.stringify({caseData, timelineEvents, documentsReady, currentMarketData}));
    alert('Case information saved successfully!');
    updateProgress();
    showSection('financial');
}

// Financial Analysis Functions
function analyzeFinancialImpact() {
    caseData.monthlyIncome = document.getElementById('monthlyIncome').value;
    caseData.otherMajorExpenses = document.getElementById('otherMajorExpenses').value;
    caseData.householdSize = document.getElementById('householdSize').value;
    caseData.specialCircumstances = document.getElementById('specialCircumstances').value;
    
    if (!caseData.monthlyIncome || !caseData.currentRent || !caseData.proposedRent) {
        alert('Please enter monthly income, current rent, and proposed rent to analyze financial impact.');
        return;
    }
    
    const currentBurden = ((parseFloat(caseData.currentRent) / parseFloat(caseData.monthlyIncome)) * 100).toFixed(1);
    const proposedBurden = ((parseFloat(caseData.proposedRent) / parseFloat(caseData.monthlyIncome)) * 100).toFixed(1);
    const exceedsAffordable = proposedBurden > 30;
    const increaseAmount = parseFloat(caseData.proposedRent) - parseFloat(caseData.currentRent);
    const annualIncrease = increaseAmount * 12;
    
    document.getElementById('financialAnalysisContent').innerHTML = `
        <div class="alert" style="background: ${exceedsAffordable ? '#ffebee' : '#e8f5e8'}; border-color: ${exceedsAffordable ? '#c62828' : '#4caf50'};">
            <strong>Financial Impact Assessment:</strong> The rent increase would ${exceedsAffordable ? 'exceed HUD affordability standards and create financial hardship' : 'be within HUD affordability guidelines but still creates increased burden'}.
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0;">
            <div>
                <p><strong>Current Rent Burden:</strong> ${currentBurden}%</p>
                <p><strong>Proposed Rent Burden:</strong> ${proposedBurden}%</p>
                <p><strong>HUD Standard (Max):</strong> 30%</p>
            </div>
            <div>
                <p><strong>Monthly Increase:</strong> $${increaseAmount.toFixed(2)}</p>
                <p><strong>Annual Increase:</strong> $${annualIncrease.toLocaleString()}</p>
                <p><strong>Affordability Status:</strong> ${exceedsAffordable ? 'Exceeds Standards' : 'Within Standards'}</p>
            </div>
        </div>
        
        ${exceedsAffordable ? `
            <div class="alert" style="background: #ffebee; border-color: #c62828;">
                <strong>Key Arguments for FRC Filing:</strong><br>
                • Rent burden exceeds HUD 30% affordability standard<br>
                • Creates risk of displacement and financial hardship<br>
                • Annual increase of $${annualIncrease.toLocaleString()} impacts essential needs budget<br>
                • Violates federal housing affordability guidelines
            </div>
        ` : ''}
    `;
    
    document.getElementById('financialAnalysisResults').style.display = 'block';
    localStorage.setItem('frcCaseData', JSON.stringify({caseData, timelineEvents, documentsReady, currentMarketData}));
    updateProgress();
}

// Navigation Functions
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Update active nav button
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(sectionId)) {
            btn.classList.add('active');
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    setupAutoSave();
    updateProgress();
    
    console.log('🎯 FRC Case Builder v4.0 - Streamlined for Single Comprehensive Filing');
    console.log('✅ Auto-save enabled');
    console.log('✅ Progress tracking active');
    console.log('✅ Professional FRC filing generation ready');
});