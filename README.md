# Smart Bharat – AI-Powered Civic Companion

![Smart Bharat](https://img.shields.io/badge/Status-Live-brightgreen) ![Version](https://img.shields.io/badge/Version-1.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

**Smart Bharat** is a purely static, client-side Single Page Application (SPA) designed to empower Indian citizens by providing seamless access to government welfare schemes, civic grievance reporting, document verification, and policy decoding—all in a sleek, multilingual interface.

Built for the **DEVENGERS PromptWars 2026 hackathon**, this application runs entirely from `index.html` without requiring Node.js, build tools, backend servers, or any external dependencies beyond Lucide icons.

---

## 🎯 Features

### 1. **Civic Portal & Issue Tracker**
- Report local public grievances (potholes, streetlights, waste, water supply issues)
- **Real-time AI Priority Classifier**: Watch the urgency badge update live as you describe the issue
- AI-powered automatic categorization and severity assessment
- Status tracking from submission to resolution
- Photo attachment support
- Geolocation integration (simulated)
- Persistent storage via browser localStorage

### 2. **Personalized Scheme Finder**
- Filter government schemes by age, income, occupation, state, and gender
- Browse real Indian welfare programs:
  - **Ayushman Bharat (PM-JAY)** – Healthcare coverage
  - **PM Kisan Samman Nidhi** – Agricultural support
  - **PM Awasiya Yojana** – Affordable housing
  - **PM SVANidhi** – Street vendor micro-credit
  - **MahaDBT Post-Matric Scholarships** – Educational aid
  - **Ladki Bahin Yojana** – Women welfare
  - **Pradhan Mantri MUDRA Yojana** – Business loans
  - **Atal Pension Yojana** – Pension schemes
- Direct navigation to document verification for matched schemes

### 3. **Document Helper & AI OCR Simulator**
- Select government schemes and view required documents
- Simulated AI-powered OCR document scanner
- Support for:
  - Aadhaar Card verification
  - PAN Card validation
  - Ration Card checking
  - Income Certificate authentication
- Real-time verification status with detailed feedback
- Auto-checklist population on successful verification

### 4. **Smart Policy & Document Decoder**
- Paste complex government policies or circulars
- AI-powered simplification engine
- Returns:
  - **Simplified Summary** – Plain-language overview
  - **Key Takeaways** – Essential bullet points
  - **Citizen Action Items** – Steps to take
- Pre-loaded sample policies (GST, Education, Data Privacy)
- Action item checklist with completion tracking

### 5. **AI Companion Chatbot**
- **Streaming response effect** – Messages appear character-by-character
- Context-aware answers about government schemes
- Support for queries about:
  - Pension schemes
  - Educational scholarships
  - Business loans
  - Agricultural support
  - Identity documents
- Quick-prompt suggestions
- Multilingual support

### 6. **Multilingual Interface**
Fully localized to 5 languages with native script rendering:
- 🇬🇧 **English**
- 🇮🇳 **हिंदी (Hindi)**
- 🇮🇳 **मराठी (Marathi)**
- 🇮🇳 **தமிழ் (Tamil)**
- 🇮🇳 **తెలుగు (Telugu)**

### 7. **Theme Support**
- **Dark Mode** (default) – Eye-friendly for civic portals
- **Light Mode** – High-contrast variant
- Smooth theme transitions

---

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Glassmorphism design system with CSS variables
- **Icons**: Lucide Icons (unpkg CDN)
- **Fonts**: Google Fonts (Inter, Mukta)
- **State Management**: Vanilla JavaScript (window.SmartBharat namespace)
- **Storage**: Browser localStorage
- **Architecture**: Client-side SPA with no backend

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No installation, build process, or server required

### Installation & Running

1. **Download the project** or clone the repository:
   ```bash
   git clone <repository-url>
   cd sanskar
   ```

2. **Open in browser**:
   - Simply double-click `index.html` to open in your default browser, OR
   - Run a local HTTP server (recommended for best experience):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (http-server)
     npx http-server
     ```
   - Then visit `http://localhost:8000` in your browser

3. **Start using**:
   - Navigate between tabs using the sidebar
   - Fill in your profile to explore eligible schemes
   - Report civic issues with photo attachments
   - Chat with the AI companion
   - Decode government policies

---

## 📂 Project Structure

```
sanskar/
├── index.html                 # Main SPA template
├── style.css                  # Glassmorphism design system
├── main.js                    # Application routing & state
├── js/
│   ├── mock-data.js          # Localization, schemes, intents data
│   ├── ai-companion.js       # Chatbot with streaming responses
│   ├── scheme-recommender.js # Eligibility matching engine
│   ├── issue-reporter.js     # Civic grievance form + real-time classifier
│   ├── document-helper.js    # OCR simulator & verification
│   └── policy-decoder.js     # Policy simplification logic
└── README.md                  # This file
```

---

## 🏗 Architecture

### Global Namespace: `window.SmartBharat`

All modules attach to a single global namespace to maintain clean separation without ES modules:

```javascript
window.SmartBharat = {
  LOCALIZATION: {...},           // Multi-language dictionary
  SCHEMES: [...],                // Government scheme database
  CHAT_BOT_INTENTS: [...],      // Chatbot intent patterns
  DOC_VERIFICATION_CRITERIA: {...},
  initAICompanion: function() {},
  initSchemeRecommender: function() {},
  initIssueReporter: function() {},
  initDocumentHelper: function() {},
  initPolicyDecoder: function() {}
}
```

### Module Loading Order
1. **index.html** – DOM structure
2. **style.css** – Visual styling
3. **Lucide icons** – Vector icons library
4. **mock-data.js** – Shared data (LOCALIZATION, SCHEMES, INTENTS)
5. **ai-companion.js** – Chat module
6. **scheme-recommender.js** – Scheme matching
7. **issue-reporter.js** – Grievance system
8. **document-helper.js** – OCR & verification
9. **policy-decoder.js** – Policy simplification
10. **main.js** – App routing & initialization

---

## ✨ Key Implementation Highlights

### 1. Real-Time AI Priority Classifier
```javascript
// Listens to textarea input and dynamically updates urgency badge
const criticalKeywords = ['sparking', 'danger', 'accident', 'flooding', 'fire'];
if (criticalKeywords.some(k => description.includes(k))) {
  badge.textContent = '🚨 AI Assessment: Critical Priority';
  badge.className = 'ai-priority-badge priority-critical';
}
```

### 2. Streaming Chatbot Responses
```javascript
// Character-by-character typing effect at 15ms intervals
const timer = setInterval(() => {
  if (index < fullText.length) {
    content.textContent += fullText[index++];
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}, 15);
```

### 3. Dynamic Language Switching
```javascript
// Real-time UI translation on language selection
state.onLanguageChange((newLang) => {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = LOCALIZATION[newLang][key];
  });
});
```

### 4. Eligibility Matching
```javascript
// Filters schemes based on user profile
const matches = SCHEMES.filter(scheme => {
  if (profile.age < scheme.eligibility.minAge) return false;
  if (profile.income > scheme.eligibility.maxIncome) return false;
  if (scheme.eligibility.occupations && 
      !scheme.eligibility.occupations.includes(profile.occupation)) return false;
  return true;
});
```

---

## 📱 Responsive Design

- **3-column grid layout**: Sidebar | Main content | Chat drawer
- **Glassmorphism UI**: Frosted glass cards with backdrop blur
- **Adaptive spacing**: Scales gracefully across device sizes
- **Touch-friendly**: Large buttons and form fields for mobile

---

## 🌍 Supported Indian Government Schemes

| Scheme | Category | Eligibility |
|--------|----------|-------------|
| Ayushman Bharat (PM-JAY) | Healthcare | Income-based, all states |
| PM Kisan Samman Nidhi | Agriculture | Farmer occupation |
| PM Awasiya Yojana | Housing | EWS/LIG households |
| PM SVANidhi | Business | Street vendors, artisans |
| MahaDBT Post-Matric Scholarships | Education | SC/ST/OBC students |
| Ladki Bahin Yojana | Women Welfare | Maharashtra state |
| PM MUDRA Yojana | Business | Micro-entrepreneurs |
| Atal Pension Yojana | Pension | Unorganized sector workers |

---

## 🔐 Privacy & Data

- **No backend servers**: All data processing happens client-side
- **No data transmission**: Information stays in the user's browser
- **localStorage persistence**: Complaints and preferences saved locally
- **No tracking**: No analytics, cookies, or third-party integrations

---

## 🎨 Design System

### Color Palette
- **Primary Background**: `#0a0f1d` (dark slate)
- **Accent Colors**: Saffron (`#ff8c00`), Emerald (`#10b981`), Gold (`#fbbf24`), Blue (`#3b82f6`)
- **Glassmorphism**: `rgba(15, 23, 42, 0.45)` with `blur(16px)`

### Typography
- **Sans-serif**: Inter (clean, professional)
- **Regional scripts**: Mukta (pixel-perfect Devanagari rendering)
- **Bold hierarchy**: Headers use `font-weight: 800`

---

## 🚀 Extending the Application

### Adding a New Language
1. Add locale to `window.SmartBharat.LOCALIZATION` in `mock-data.js`
2. Add language option to `<select id="app-lang-select">` in `index.html`
3. Translations will auto-apply on selection

### Adding a New Government Scheme
1. Add object to `window.SmartBharat.SCHEMES` array in `mock-data.js`
2. Include `id`, `name`, `ministry`, `category`, `benefits`, `eligibility`, `documents`
3. Will automatically appear in Scheme Finder

### Adding Document Verification Types
1. Add criteria to `window.SmartBharat.DOC_VERIFICATION_CRITERIA` in `mock-data.js`
2. Include `name`, `mustContain`, `formatRegex`, `sampleError`
3. OCR simulator will recognize the new document type

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't load | Check browser console for errors; ensure all JS files are in correct paths |
| Icons missing | Icons load from Lucide unpkg CDN; check internet connection |
| Forms not responding | Ensure JavaScript is enabled; try clearing localStorage |
| Language not changing | Refresh page after selection; check browser console |
| Dark mode not working | Check localStorage settings; try clearing cache |

---

## 📊 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🏆 Hackathon Submission Details

**Project Name**: Smart Bharat – AI-Powered Civic Companion  
**Event**: DEVENGERS PromptWars 2026  
**Category**: Civic Tech / Government Services  
**Tech Stack**: Vanilla HTML, CSS, JavaScript (100% static SPA)  
**Deployment**: Works directly from `index.html` file  
**Features Implemented**:
- Real-time AI urgency classification
- Streaming AI companion responses
- 8 major Indian government schemes
- 5 languages + regional script support
- Simulated OCR document verification
- Policy/circular simplification
- Dark/light theme support

---

## 📝 License

This project is open-source and available under the MIT License.

---

## 👥 Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues, questions, or feedback, please open an issue in the repository or contact the development team.

---

## 🙏 Acknowledgments

- **Lucide Icons** – Beautiful open-source icon library
- **Google Fonts** – Inter and Mukta typefaces
- **Indian Government Schemes** – Official documentation references
- **DEVENGERS Community** – For hosting PromptWars 2026

---

**Built with ❤️ for Indian citizens | Made in 🇮🇳**
