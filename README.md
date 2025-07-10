# Connecticut Fair Rent Commission Case Prep Tool

A comprehensive web application to help Connecticut tenants prepare professional Fair Rent Commission (FRC) filings to cha  llenge excessive rent increases.

## 🎯 Features

- **Case Information Management** - Collect and organize tenant, landlord, and property details
- **Financial Hardship Analysis** - Calculate rent burden using HUD affordability standards (30% threshold)
- **Document Preparation Checklist** - Guided document gathering with submission requirements
- **Timeline Builder** - Chronological event tracking for case evidence
- **Market Analysis** - Comparable property research with strategic filtering
- **Professional FRC Filing Generation** - Ready-to-submit PDF documents
- **Auto-save & Progress Tracking** - Never lose your work

## 🚀 Live Demo

Visit the live application: [https://jqqqq313.github.io/FRC-test](https://jqqqq313.github.io/FRC-test)

## 📋 Connecticut Fair Rent Commission Coverage

This tool supports tenants in municipalities with Fair Rent Commissions:
- Bridgeport
- Hartford 
- New Haven
- Other Connecticut towns with FRC ordinances

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
- **PDF Generation**: jsPDF library
- **Storage**: LocalStorage for data persistence
- **Deployment**: GitHub Pages
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
├── index.html              # Main application entry point
├── src/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   └── js/
│       └── app.js          # Application logic
├── docs/                   # Documentation files
├── assets/                 # Static assets
├── README.md              # Project documentation
├── package.json           # Project metadata
└── LICENSE               # MIT license
```

## 🚀 Getting Started

### For End Users
Simply visit the [live application](https://jqqqq313.github.io/FRC-test) - no installation required!

### For Developers

1. **Clone the repository**
   ```bash
   git clone https://github.com/jqqqq313/FRC-test.git
   cd FRC-test
   ```

2. **Open locally**
   ```bash
   # Serve with any static file server
   python -m http.server 8000
   # or
   npx serve .
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📖 Usage Guide

### Step 1: Case Information
- Enter tenant, landlord, and property details
- Specify current vs. proposed rent amounts
- Select primary basis for challenging the increase

### Step 2: Financial Analysis  
- Input household income and expenses
- Tool automatically calculates rent burden percentage
- Identifies HUD affordability standard violations (>30%)

### Step 3: Evidence Preparation
- **Document Checklist**: Mark documents as ready for submission
- **Timeline**: Add chronological events with dates and descriptions

### Step 4: Market Analysis
- Research comparable properties by type, bedrooms, and location
- Tool strategically shows only properties with lower rents (when applicable)

### Step 5: Generate FRC Filing
- Select relief requested (deny, reduce, delay increase, or rollback)
- Generate professional PDF filing ready for FRC submission

## 🔧 Key Features

### Smart Market Analysis
- Filters comparable properties to show only rent-supporting evidence
- Calculates percentage above/below market rate
- Provides strategic recommendations based on market position

### Professional PDF Generation
- Multi-page support with proper formatting
- Auto-generated filenames with tenant name and date
- Ready for direct submission to Fair Rent Commission

### Data Persistence
- Auto-save functionality prevents data loss
- Progress tracking across all sections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License.

## ⚖️ Legal Disclaimer

This tool provides general information and document generation assistance for Connecticut Fair Rent Commission filings. It is not a substitute for legal advice. For specific legal guidance, consult with a qualified attorney familiar with Connecticut fair rent laws.

## 📞 Support

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/jqqqq313/FRC-test/issues)
- **Legal Resources**: Links to Fair Rent Commission contacts included in application

## 🏆 Project Evolution

- **v1.0**: Basic case information collection
- **v2.0**: Added data persistence and evidence analysis  
- **v3.0**: Market analysis and legal precedent research
- **v4.0**: Streamlined single filing workflow, smart document checklist
- **Current**: Professional project structure with proper code organization

---

**Built for Connecticut tenants fighting unfair rent increases** 🏠⚖️
