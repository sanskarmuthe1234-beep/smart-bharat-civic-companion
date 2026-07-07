window.SmartBharat = window.SmartBharat || {};

window.SmartBharat.initPolicyDecoder = function(state) {
  const LOCALIZATION = window.SmartBharat.LOCALIZATION;

  const textarea = document.getElementById('policy-input');
  const decodeBtn = document.getElementById('decode-btn');
  const resultPanel = document.getElementById('decode-result-panel');
  const summaryEl = document.getElementById('decode-summary');
  const takeawaysEl = document.getElementById('decode-takeaways');
  const actionsEl = document.getElementById('decode-actions');

  if (!textarea || !decodeBtn || !resultPanel || !summaryEl || !takeawaysEl || !actionsEl) return;

  function analyzePolicyText(text) {
    const txtLower = text.toLowerCase();

    // 1. Check if the text matches Taxation/GST
    if (txtLower.includes("tax") || txtLower.includes("gst") || txtLower.includes("finance") || txtLower.includes("budget")) {
      return {
        summary: "This document outlines changes to public tax brackets and compliance standards. It aims to reduce intermediate transaction costs and simplify digital invoicing for mid-tier merchants.",
        takeaways: [
          "Merchants with turnover below ₹40 Lakhs remain exempted from standard GST registration.",
          "Filing frequencies for quarterly return providers are now synchronized on the 18th of the succeeding month.",
          "Introduction of a single-tap verification mechanism for input tax credits to avoid manual auditing logs."
        ],
        actions: [
          "Check if your annual business revenue exceeds the ₹40 Lakh exemption threshold.",
          "Verify your bank accounts are linked to your GST portal for automated credit sync.",
          "File quarterly returns before the new 18th date to avoid late penalty levies."
        ]
      };
    }

    // 2. Check if the text matches Education/NEP
    if (txtLower.includes("education") || txtLower.includes("school") || txtLower.includes("university") || txtLower.includes("student") || txtLower.includes("nep")) {
      return {
        summary: "This circular details updates to national school evaluation frameworks. It pivots away from strict rote-learning assessments towards descriptive cumulative performance dashboards.",
        takeaways: [
          "Introduction of a 360-degree multidimensional report card system incorporating self, peer, and teacher feedback.",
          "Core focus on bilingual literacy training up to Grade 5, prioritizing mother tongues/regional dialects.",
          "Flexible credit-bank provisions allowing university students to pause coursework and resume within 3 years."
        ],
        actions: [
          "Parents should check the new progress dashboard format at school parent-teacher council reviews.",
          "Students seeking higher education should register on the Academic Bank of Credits (ABC) portal.",
          "Verify if your local state university supports multi-point exit options for your degree program."
        ]
      };
    }

    // 3. Check if the text matches Digital/Cyber/Data Privacy
    if (txtLower.includes("digital") || txtLower.includes("data") || txtLower.includes("privacy") || txtLower.includes("internet") || txtLower.includes("telecom")) {
      return {
        summary: "This draft focuses on safeguarding user personal information on digital services. It mandates explicit consent frameworks before platforms store or process demographic credentials.",
        takeaways: [
          "Platforms must appoint a designated Grievance Officer accessible within India.",
          "Users retain the 'Right to Erasure' to delete all their records from private servers.",
          "Strict penalties are established for platforms that share information without multi-factor authorization."
        ],
        actions: [
          "Review privacy settings on major social platforms to check what consent is active.",
          "Save the official email address of your digital providers' Grievance Officer.",
          "Exercise your right to delete old unused online accounts to protect your details."
        ]
      };
    }

    // Fallback/Generic parser
    return {
      summary: "This document covers general public administrative guidelines. Our AI has simplified its formatting, removing legal vocabulary and dry statutory clauses to clarify its core meaning.",
      takeaways: [
        "Identified primary terms focusing on public safety and regional registry updates.",
        "The mandate seeks to digitize paper records to speed up delivery timelines.",
        "Official feedback channels are open to let citizens file complaints or register inquiries."
      ],
      actions: [
        "Ensure your primary identity papers (Aadhaar/PAN) are updated and readily accessible.",
        "Check your municipal service website for new digital online application links.",
        "Report any administrative difficulty directly using our Civic Grievance module."
      ]
    };
  }

  decodeBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) {
      alert("Please paste some government circular or policy text first!");
      return;
    }

    decodeBtn.innerText = "Decoding via AI...";
    decodeBtn.disabled = true;

    // Simulate AI parsing delay
    setTimeout(() => {
      const decoded = analyzePolicyText(text);

      summaryEl.innerText = decoded.summary;
      
      takeawaysEl.innerHTML = '';
      decoded.takeaways.forEach(tk => {
        const li = document.createElement('li');
        li.innerText = tk;
        takeawaysEl.appendChild(li);
      });

      actionsEl.innerHTML = '';
      decoded.actions.forEach(ac => {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" class="policy-action-chk"> ${ac}`;
        actionsEl.appendChild(li);
      });

      resultPanel.style.display = 'block';
      decodeBtn.innerText = "Decode & Simplify Document";
      decodeBtn.disabled = false;

      // Scroll to result
      resultPanel.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  });
};
