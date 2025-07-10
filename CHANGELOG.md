# Changelog

All notable changes to the Connecticut Fair Rent Commission Case Prep Tool will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2024-12-19

### 🏗️ Project Structure
- **Added**: Professional project structure with `src/`, `docs/`, `assets/` directories
- **Added**: Comprehensive README.md with usage instructions and project overview
- **Added**: package.json with project metadata and dependencies
- **Added**: MIT LICENSE file
- **Added**: .gitignore for proper version control
- **Added**: CHANGELOG.md for version tracking

### 🔄 Code Organization
- **Moved**: CSS extracted from inline to `src/css/style.css`
- **Moved**: JavaScript modularized in `src/js/app.js`
- **Improved**: Clean separation of concerns between HTML, CSS, and JavaScript

### ✨ Features (Previously Implemented)
- **Added**: Smart document checklist replacing upload functionality
- **Added**: Professional FRC filing generation with PDF export
- **Added**: Strategic market analysis with filtered comparable properties
- **Added**: Real-time financial hardship analysis with HUD standards
- **Added**: Auto-save and progress tracking across all sections

## [3.0.0] - 2024-12-18

### ✨ Enhanced Features
- **Added**: Evidence details collection and display in FRC filing
- **Added**: Conditional comparable property pricing (only shows supportive evidence)
- **Added**: Real PDF download capability with jsPDF integration
- **Added**: Professional document formatting and auto-generated filenames

### 🔧 Improvements
- **Enhanced**: Market analysis with strategic property filtering
- **Enhanced**: FRC filing output with detailed evidence documentation
- **Enhanced**: PDF generation with multi-page support and proper formatting

## [2.0.0] - 2024-12-17

### 🛡️ Document Management Overhaul
- **Replaced**: Misleading file upload interface with honest document checklist
- **Added**: Detailed submission requirements for each document type
- **Added**: Document readiness tracking with checkbox interface
- **Improved**: Clear instructions for physical document submission

### 📝 Filing Generation
- **Updated**: FRC filing to show submission instructions instead of file details
- **Streamlined**: Workflow focuses on document gathering vs fake uploads
- **Enhanced**: More practical approach for actual FRC submission process

## [1.0.0] - 2024-12-16

### 🎉 Initial Release
- **Added**: Complete streamlined FRC case preparation workflow
- **Added**: Single comprehensive filing generation (replaces multiple reports)
- **Added**: Six focused sections: Case Info, Financial Impact, Evidence, Market Analysis, Filing Generation, Resources
- **Added**: HUD affordability analysis (30% threshold)
- **Added**: Timeline builder for chronological event tracking
- **Added**: Market analysis with comparable property research
- **Added**: LocalStorage data persistence with auto-save
- **Added**: Progress tracking and section completion indicators
- **Added**: Professional PDF and print functionality
- **Added**: Connecticut Fair Rent Commission resource directory

### 🏠 Target Municipalities
- **Support**: Bridgeport, Hartford, New Haven Fair Rent Commissions
- **Ready**: For other Connecticut towns with FRC ordinances

---

**Key**: 🎉 Initial | ✨ Feature | 🔧 Enhancement | 🛡️ Security | 🐛 Bug Fix | 🔄 Refactor | 🏗️ Structure