window.SmartBharat = window.SmartBharat || {};

window.SmartBharat.initAICompanion = function(state) {
  const CHAT_BOT_INTENTS = window.SmartBharat.CHAT_BOT_INTENTS;
  const LOCALIZATION = window.SmartBharat.LOCALIZATION;

  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const chatMessages = document.getElementById('chat-messages');
  const suggestionsBox = document.getElementById('chat-suggestions');

  if (!chatInput || !sendBtn || !chatMessages || !suggestionsBox) return;

  const suggestions = {
    en: [
      "How to apply for a Passport?",
      "Am I eligible for Ayushman Bharat?",
      "How do I update my Aadhaar Address?",
      "How can I report a broken streetlight?"
    ],
    hi: [
      "पासपोर्ट के लिए आवेदन कैसे करें?",
      "क्या मैं आयुष्मान भारत के लिए पात्र हूँ?",
      "मैं अपना आधार पता कैसे अपडेट करूँ?",
      "टूटी हुई स्ट्रीटलाइट की रिपोर्ट कैसे करूँ?"
    ],
    ta: [
      "பாஸ்போர்ட்டுக்கு விண்ணப்பிப்பது எப்படி?",
      "நான் ஆயுஷ்மான் பாரத்திற்கு தகுதியானவரா?",
      "ஆதார் முகவரியை எவ்வாறு புதுப்பிப்பது?",
      "தெருவிளக்கு பழுதடைந்ததை எப்படி புகாரளிப்பது?"
    ],
    te: [
      "పాస్‌పోర్ట్ కోసం ఎలా దరఖాస్తు చేయాలి?",
      "నేను ఆయుష్మాన్ భారత్‌కు అర్హుడినా?",
      "నా ఆధార్ చిరునామాను ఎలా అప్‌డేట్ చేయాలి?",
      "వీధి దీపం వెలగడం లేదని ఎలా నివేదించాలి?"
    ]
  };

  // Render quick suggestions based on current language
  function renderSuggestions() {
    suggestionsBox.innerHTML = '';
    const lang = state.lang || 'en';
    const list = suggestions[lang] || suggestions['en'];
    list.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'suggestion-btn';
      btn.innerText = text;
      btn.addEventListener('click', () => {
        chatInput.value = text;
        sendMessage();
      });
      suggestionsBox.appendChild(btn);
    });
  }

  function appendMessage(sender, text, isAI = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    
    const icon = document.createElement('div');
    icon.className = 'message-avatar';
    icon.innerHTML = isAI ? '<i class="lucide-bot">🤖</i>' : '<i class="lucide-user">👤</i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';

    msgDiv.appendChild(icon);
    msgDiv.appendChild(content);
    chatMessages.appendChild(msgDiv);

    if (isAI) {
      let index = 0;
      const fullText = String(text);
      content.textContent = '';
      const timer = window.setInterval(() => {
        if (index < fullText.length) {
          content.textContent += fullText[index];
          index += 1;
          chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
          window.clearInterval(timer);
        }
      }, 15);
    } else {
      content.textContent = String(text);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chat-message bot typing-indicator-wrapper';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Smart Mock AI generative query processing
  function processAIResponse(query) {
    const queryLower = query.toLowerCase();
    const lang = state.lang || 'en';

    // 1. Try to find matched intent
    for (let intent of CHAT_BOT_INTENTS) {
      for (let keyword of intent.keywords) {
        if (queryLower.includes(keyword)) {
          return intent.response[lang] || intent.response['en'];
        }
      }
    }

    // 2. Generic AI fallback response generator that parses query
    const subjects = {
      pension: ["pension", "old age", "vridha", "pension scheme", "वृद्ध", "पेंशन"],
      scholarship: ["scholarship", "student", "college", "school", "fees", "छात्रवृत्ति", "स्कूल"],
      business: ["business", "loan", "startup", "mudra", "svanidhi", "व्यापार", "ऋण", "लोन"],
      farm: ["kisan", "farmer", "agriculture", "crop", "land", "किसान", "खेती", "फसल"],
      identity: ["card", "aadhaar", "pan", "voter", "ration", "कार्ड", "आधार", "पैन", "राशन"]
    };

    let matchedCategory = null;
    for (let cat in subjects) {
      if (subjects[cat].some(k => queryLower.includes(k))) {
        matchedCategory = cat;
        break;
      }
    }

    if (lang === 'hi') {
      if (matchedCategory === 'pension') {
        return "मुझे लगा कि आप **पेंशन सेवाओं** के बारे में पूछ रहे हैं। असंगठित क्षेत्र के नागरिकों के लिए, अटल पेंशन योजना (APY) 60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 की मासिक पेंशन प्रदान करती है। पंजीकरण के लिए बैंक पासबुक और आधार कार्ड की आवश्यकता होती है।";
      } else if (matchedCategory === 'scholarship') {
        return "विद्यार्थी सहायता के लिए, भारत सरकार विभिन्न श्रेणियों (SC/ST/OBC) के लिए **पोस्ट-मैट्रिक छात्रवृत्ति** प्रदान करती है। आपको शैक्षणिक संस्थान का बोनाफाइड, आय प्रमाण पत्र और जाति प्रमाण पत्र जमा करना होगा।";
      } else if (matchedCategory === 'business') {
        return "व्यवसाय शुरू करने या बढ़ाने के लिए, आप **प्रधानमंत्री मुद्रा योजना (PMMY)** या **PM SVANidhi** (रेहड़ी-पटरी वालों के लिए) के तहत गिरवी-मुक्त ऋण प्राप्त कर सकते हैं। अधिक जानकारी के लिए 'योजना खोजक' टैब पर अपनी पात्रता की जांच करें।";
      } else if (matchedCategory === 'farm') {
        return "कृषि सहायता के लिए, **PM-KISAN** प्रति वर्ष ₹6,000 की सीधी सहायता प्रदान करता है। आपके पास स्वयं के नाम पर कृषि भूमि और आधार से जुड़ा बैंक खाता होना चाहिए।";
      } else if (matchedCategory === 'identity') {
        return "सरकारी पहचान पत्रों (आधार, पैन, राशन कार्ड) के लिए, कृपया हमारे **'दस्तावेज़ सहायक'** टैब का उपयोग करें जहाँ आप अपने वर्तमान दस्तावेज़ को सत्यापित कर सकते हैं और सुधार संबंधी जानकारी प्राप्त कर सकते हैं।";
      }
      return `आपके प्रश्न: "${query}" के आधार पर, हमारा स्मार्ट भारत डिजिटल साथी वर्तमान में डेटाबेस का विश्लेषण कर रहा है। कृपया किसी विशिष्ट सरकारी योजना (जैसे: आयुष्मान भारत, पीएम किसान, मुद्रा लोन, या पासपोर्ट) का नाम लिखें ताकि मैं आपकी बेहतर सहायता कर सकूँ!`;
    }

    // Default English
    if (matchedCategory === 'pension') {
      return "It seems you are inquiring about **Pension Services**. For unorganized sector workers, the **Atal Pension Yojana (APY)** provides a guaranteed monthly pension of ₹1,000 to ₹5,000 after age 60. You will need a savings account and Aadhaar card to link.";
    } else if (matchedCategory === 'scholarship') {
      return "For student financial assistance, the government offers various **Post-Matric Scholarships** based on category and income. Essential items include college admission proof, caste certificate, and income certificate.";
    } else if (matchedCategory === 'business') {
      return "To fund your business, you can apply for collateral-free loans under **Mudra Yojana** (up to ₹10 Lakhs) or **PM SVANidhi** (for street vendors up to ₹50k). Check the **Scheme Finder** page to view eligibility details.";
    } else if (matchedCategory === 'farm') {
      return "For farming assistance, the **PM-KISAN** scheme offers small/marginal farmers ₹6,000 annually. Ensure your land registry documents and Bank DBT are updated.";
    } else if (matchedCategory === 'identity') {
      return "For essential government cards (Aadhaar, PAN, Voter ID, Ration Card), check the **Document Helper** tab to see requirements or verify card scan status.";
    }

    return `Based on your request regarding "${query}", here is what you can do:
1. **Explore Schemes**: Head to the **Scheme Finder** tab and input your age and occupation.
2. **Report Grievances**: Visit the **Civic Portal** if you have issues with public infrastructure.
3. **Verify Cards**: Use the **Document Helper** to perform a simulated scanner check on your Aadhaar or PAN card.
Please let me know if you want information on any specific scheme!`;
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append user message
    appendMessage('user', text, false);
    chatInput.value = '';

    // Simulate AI thinking and reply
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const reply = processAIResponse(text);
      appendMessage('bot', reply, true);
    }, 1200);
  }

  // Event Listeners
  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Expose triggers
  state.onLanguageChange(() => {
    renderSuggestions();
    
    // Clear and add welcome message
    chatMessages.innerHTML = '';
    const welcome = {
      en: "Hello! I am your **Smart Bharat Companion**. How can I help you today? You can ask about government welfare schemes, civic complaints, document requirements, or ask me to translate details.",
      hi: "नमस्ते! मैं आपका **स्मार्ट भारत साथी** हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ? आप सरकारी कल्याण योजनाओं, नागरिक शिकायतों, दस्तावेज़ आवश्यकताओं के बारे में पूछ सकते हैं।",
      ta: "வணக்கம்! நான் உங்கள் **ஸ்மார்ட் பாரத் உதவியாளர்**. இன்று உங்களுக்கு நான் எவ்வாறு உதவ முடியும்? அரசு நலத்திட்டங்கள், குடிமைப் புகார்கள் அல்லது ஆவணத் தேவைகள் பற்றி நீங்கள் கேட்கலாம்.",
      te: "నమస్తే! నేను మీ **స్మార్ట్ భారత్ సహచరుడిని**. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను? మీరు ప్రభుత్వ సంక్షేమ పథకాలు, పౌర ఫిర్యాదులు లేదా పత్రాల అవసరాల గురించి అడగవచ్చు."
    };
    appendMessage('bot', welcome[state.lang] || welcome['en'], true);
  });

  // Initial call
  renderSuggestions();
  appendMessage('bot', "Hello! I am your **Smart Bharat Companion**. How can I help you today? You can ask about government welfare schemes, civic complaints, document requirements, or ask me to translate details.", true);
};
