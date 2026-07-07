// Fetch references from the global namespace
window.SmartBharat = window.SmartBharat || {};
const LOCALIZATION = window.SmartBharat.LOCALIZATION || {};
const initAICompanion = window.SmartBharat.initAICompanion || function() {};
const initSchemeRecommender = window.SmartBharat.initSchemeRecommender || function() {};
const initIssueReporter = window.SmartBharat.initIssueReporter || function() {};
const initDocumentHelper = window.SmartBharat.initDocumentHelper || function() {};
const initPolicyDecoder = window.SmartBharat.initPolicyDecoder || function() {};

// Application State Management
class AppState {
  constructor() {
    this.lang = localStorage.getItem('smart_bharat_lang') || 'en';
    this.currentPage = 'home';
    this.langListeners = [];
  }

  setCurrentPage(pageId) {
    this.currentPage = pageId;
    
    // Manage active state in Nav Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      if (tab.getAttribute('data-page') === pageId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Manage active page view
    document.querySelectorAll('.page-view').forEach(view => {
      if (view.id === `page-${pageId}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });
  }

  setLanguage(lang) {
    this.lang = lang;
    localStorage.setItem('smart_bharat_lang', lang);
    this.translateUI();
    this.langListeners.forEach(callback => callback(lang));
  }

  onLanguageChange(callback) {
    this.langListeners.push(callback);
  }

  translateUI() {
    const dict = LOCALIZATION[this.lang] || LOCALIZATION['en'];
    
    // Translate standard components marked with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (dict[key]) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = dict[key];
        } else {
          element.innerText = dict[key];
        }
      }
    });

    // Update main navigation subtitle and title if translations exist
    const subtitleEl = document.getElementById('nav-subtitle');
    const titleEl = document.getElementById('nav-title');
    if (subtitleEl && dict.subtitle) subtitleEl.innerText = dict.subtitle;
    if (titleEl && dict.title) titleEl.innerText = dict.title;

    // Chatbot placeholder correction
    const chatInput = document.getElementById('chat-input');
    if (chatInput && dict.chat_placeholder) {
      chatInput.placeholder = dict.chat_placeholder;
    }
  }
}

// Instantiate state
const state = new AppState();

// Initialize UI Interactions on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Routing & Views
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPage = tab.getAttribute('data-page');
      state.setCurrentPage(targetPage);
    });
  });

  // 2. Language Selector Setup
  const langSelect = document.getElementById('app-lang-select');
  if (langSelect) {
    langSelect.value = state.lang;
    langSelect.addEventListener('change', (e) => {
      state.setLanguage(e.target.value);
    });
  }

  // 3. Dark/Light Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
  // Set default body class based on stored choice
  const isLight = localStorage.getItem('smart_bharat_light_theme') === 'true';
  if (isLight) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (document.body.classList.contains('light-theme')) {
        document.body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('smart_bharat_light_theme', 'false');
      } else {
        document.body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('smart_bharat_light_theme', 'true');
      }
    });
  }

  // 4. Floating Chat Toggle sizing button (for wider screens)
  const chatDrawer = document.getElementById('chat-drawer-container');
  const toggleChatBtn = document.getElementById('toggle-chat-size-btn');
  
  if (toggleChatBtn && chatDrawer) {
    toggleChatBtn.addEventListener('click', () => {
      chatDrawer.classList.toggle('minimized');
      toggleChatBtn.innerHTML = chatDrawer.classList.contains('minimized')
        ? '<i data-lucide="chevron-left"></i>'
        : '<i data-lucide="chevron-right"></i>';

      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  }

  // 5. Policy Sample Text Insertions
  const policySamples = {
    gst: `Circular No. 195/07/2026-GST:
Subject: Clarification on GST compliance threshold and digital invoicing protocols.

Pursuant to decisions of the GST Council, it is hereby clarified that taxpayers with an aggregate annual turnover below Rupees Forty Lakhs (₹40,00,000) are exempt from registration requirements under section 22(1) of the Act. Furthermore, quarterly filing entities must file Form GSTR-1 by the 18th of the month following the quarter. To reduce auditing complexity, input tax credit verification checks are streamlined via automated APIs, avoiding manual invoice tallying.`,
    nep: `National Evaluation Assessment Framework Circular 2026:
Subject: Implementation of Multidimensional Evaluation Matrix for Secondary Grades.

In compliance with the National Education Policy guidelines, all affiliated schools are mandated to implement a 360-degree holistic assessment card. The grading mechanism pivots from rigid summative examinations to formative self-evaluation, peer reviews, and descriptively detailed teacher evaluations. Primary instruction (Grades 1 to 5) must prioritize bilingual or mother tongue delivery to facilitate comprehension. Credits earned are eligible for storage in the national Academic Bank of Credits (ABC) repository, allowing multi-point exit pathways.`,
    data: `Draft Notification on Personal Data Protection Regulations:
Subject: Section 14 - Data Protection and Consent Protocols.

Platforms offering digital public services are hereby directed to implement explicit consent banners prior to capturing user demographic metrics. Citizens retain the absolute Right to Erasure, authorizing them to request total deletion of their profile archives from active database tables. Digital systems must assign a localized Grievance Redressal Officer in India, responsible for addressing user privacy inquiries. Unauthorized sharing of user records with external parties without multi-factor authorization is subject to compliance penalties.`
  };

  document.querySelectorAll('.sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-policy');
      const textEl = document.getElementById('policy-input');
      if (textEl && policySamples[type]) {
        textEl.value = policySamples[type];
      }
    });
  });

  // 6. Initialize Module Functions
  initAICompanion(state);
  initSchemeRecommender(state);
  initIssueReporter(state);
  initDocumentHelper(state);
  initPolicyDecoder(state);

  // 7. Perform Initial Translation
  state.translateUI();

  // 8. Replace Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
