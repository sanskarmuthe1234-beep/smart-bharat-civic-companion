window.SmartBharat = window.SmartBharat || {};

window.SmartBharat.initIssueReporter = function(state) {
  const LOCALIZATION = window.SmartBharat.LOCALIZATION;

  const form = document.getElementById('issue-form');
  const complaintsList = document.getElementById('complaints-list');
  const fileInput = document.getElementById('issue-photo');
  const filePreview = document.getElementById('photo-preview');
  const urgencyBadge = document.getElementById('ai-priority-badge');
  const descInput = document.getElementById('issue-desc');

  if (!form || !complaintsList) return;

  // Load complaints from localStorage or use default mock ones
  let complaints = JSON.parse(localStorage.getItem('smart_bharat_complaints')) || [
    {
      id: "comp-101",
      category: "Streetlight",
      description: "Streetlight is broken near Main Market crossing, making the road completely dark at night and unsafe for women and children.",
      location: "Main Market, Sector 4, New Delhi",
      photo: null,
      severity: "Medium",
      time: "3 Days",
      aiSummary: "Non-functional streetlighting creating safety risk at high-traffic crossing.",
      status: "dispatch", // submitted, review, dispatch, resolved
      date: "2026-07-06"
    },
    {
      id: "comp-102",
      category: "Potholes",
      description: "Huge waterlogged pothole has formed in the middle of Sector 12 highway. Two motorcyclists slipped today. Extremely critical.",
      location: "Highway 48, Near Sector 12 Exit, Gurgaon",
      photo: null,
      severity: "Critical",
      time: "24 Hours",
      aiSummary: "Deep waterlogged pothole on high-speed highway causing accidents.",
      status: "review",
      date: "2026-07-07"
    }
  ];

  function saveComplaints() {
    localStorage.setItem('smart_bharat_complaints', JSON.stringify(complaints));
  }

  function updateUrgencyBadge(desc) {
    if (!urgencyBadge) return;

    const descLower = (desc || '').toLowerCase();
    const criticalKeywords = ['sparking', 'danger', 'accident', 'flooding', 'fire', 'collapse', 'injury', 'gas'];
    const mediumKeywords = ['dark', 'foul', 'block', 'broke', 'noise', 'leak', 'garbage'];

    if (criticalKeywords.some(keyword => descLower.includes(keyword))) {
      urgencyBadge.textContent = '🚨 AI Assessment: Critical Priority';
      urgencyBadge.className = 'ai-priority-badge priority-critical';
    } else if (mediumKeywords.some(keyword => descLower.includes(keyword))) {
      urgencyBadge.textContent = '⚡ AI Assessment: Medium Priority';
      urgencyBadge.className = 'ai-priority-badge priority-medium';
    } else {
      urgencyBadge.textContent = '📋 AI Assessment: Standard Priority';
      urgencyBadge.className = 'ai-priority-badge priority-standard';
    }
  }

  if (descInput) {
    descInput.addEventListener('input', (event) => {
      updateUrgencyBadge(event.target.value);
    });
    updateUrgencyBadge(descInput.value);
  }

  // Handle Photo Preview
  if (fileInput && filePreview) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-height: 120px; border-radius: 8px;">`;
        };
        reader.readAsDataURL(file);
      } else {
        filePreview.innerHTML = '';
      }
    });
  }

  // Simple Mock AI Analysis function
  function analyzeComplaintAI(desc, cat) {
    const descLower = desc.toLowerCase();
    let severity = "Low";
    let time = "7-10 Days";
    let inferredCat = cat || "General";

    // Infer category if general
    if (inferredCat === "General") {
      if (descLower.includes("light") || descLower.includes("dark") || descLower.includes("lamp")) {
        inferredCat = "Streetlight";
      } else if (descLower.includes("road") || descLower.includes("pothole") || descLower.includes("cracks")) {
        inferredCat = "Potholes";
      } else if (descLower.includes("water") || descLower.includes("leak") || descLower.includes("pipe") || descLower.includes("drain")) {
        inferredCat = "Water Supply";
      } else if (descLower.includes("garbage") || descLower.includes("waste") || descLower.includes("trash") || descLower.includes("clean")) {
        inferredCat = "Waste Management";
      }
    }

    // Determine severity
    if (descLower.includes("accident") || descLower.includes("hurt") || descLower.includes("hospital") || descLower.includes("danger") || descLower.includes("critical") || descLower.includes("flood") || descLower.includes("injury") || descLower.includes("sparking") || descLower.includes("flooding") || descLower.includes("fire") || descLower.includes("gas") || descLower.includes("collapse")) {
      severity = "Critical";
      time = "24 Hours";
    } else if (descLower.includes("dark") || descLower.includes("foul") || descLower.includes("block") || descLower.includes("leak") || descLower.includes("broke") || descLower.includes("garbage") || descLower.includes("noise")) {
      severity = "Medium";
      time = "3 Days";
    }

    // Generate formal summary
    let summaryWords = desc.split(" ").slice(0, 10).join(" ") + "...";
    if (inferredCat === "Streetlight") {
      summaryWords = "Report of non-functional public illumination causing security/visibility concern.";
    } else if (inferredCat === "Potholes") {
      summaryWords = "Request for urgent road repairs due to structural damage/potholes posing traffic risks.";
    } else if (inferredCat === "Water Supply") {
      summaryWords = "Water infrastructure anomaly/leakage reported, disrupting local utility supply.";
    } else if (inferredCat === "Waste Management") {
      summaryWords = "Grievance regarding waste accumulation, sanitization lag, or garbage collection default.";
    }

    return { severity, time, category: inferredCat, aiSummary: summaryWords };
  }

  function renderComplaints() {
    const lang = state.lang || 'en';
    complaintsList.innerHTML = '';

    complaints.forEach((comp) => {
      const card = document.createElement('div');
      card.className = 'complaint-card fade-in';

      // Define status step indicators
      const steps = [
        { id: 'submitted', label: LOCALIZATION[lang].status_submitted },
        { id: 'review', label: LOCALIZATION[lang].status_review },
        { id: 'dispatch', label: LOCALIZATION[lang].status_dispatch },
        { id: 'resolved', label: LOCALIZATION[lang].status_resolved }
      ];

      let currentStepIndex = steps.findIndex(s => s.id === comp.status);
      if (currentStepIndex === -1) currentStepIndex = 0;

      let stepsHTML = steps.map((step, idx) => {
        let cls = '';
        if (idx < currentStepIndex) cls = 'completed';
        else if (idx === currentStepIndex) cls = 'active';
        return `
          <div class="status-step ${cls}">
            <div class="step-circle">${idx + 1}</div>
            <div class="step-label">${step.label}</div>
          </div>
        `;
      }).join('');

      let severityClass = `severity-${comp.severity.toLowerCase()}`;

      card.innerHTML = `
        <div class="complaint-card-header">
          <span class="complaint-id">ID: ${comp.id}</span>
          <span class="complaint-date">${comp.date}</span>
          <span class="severity-badge ${severityClass}">${comp.severity} Priority</span>
        </div>
        <div class="complaint-body">
          <h3>Category: ${comp.category}</h3>
          <p class="desc"><strong>Description:</strong> ${comp.description}</p>
          <p class="location">📍 ${comp.location}</p>
          
          <div class="ai-insight-box">
            <h4>💡 AI Assessment:</h4>
            <p><strong>Formal Summary:</strong> ${comp.aiSummary}</p>
            <p><strong>Estimated Resolution Time:</strong> ${comp.time}</p>
          </div>

          ${comp.photo ? `<div class="complaint-img-wrapper"><img src="${comp.photo}" alt="Issue Attachment"></div>` : ''}
        </div>

        <div class="status-timeline-wrapper">
          <div class="status-timeline">
            ${stepsHTML}
          </div>
        </div>
      `;

      complaintsList.appendChild(card);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const desc = document.getElementById('issue-desc').value;
    const cat = document.getElementById('issue-cat-select').value;
    const loc = document.getElementById('issue-location').value;
    const imgEl = filePreview ? filePreview.querySelector('img') : null;
    const photo = imgEl ? imgEl.src : null;

    // AI Analysis
    const aiResult = analyzeComplaintAI(desc, cat);

    const newGrievance = {
      id: "comp-" + Math.floor(100 + Math.random() * 900),
      category: aiResult.category,
      description: desc,
      location: loc,
      photo: photo,
      severity: aiResult.severity,
      time: aiResult.time,
      aiSummary: aiResult.aiSummary,
      status: "submitted",
      date: new Date().toISOString().split('T')[0]
    };

    complaints.unshift(newGrievance);
    saveComplaints();
    renderComplaints();

    // Reset Form
    form.reset();
    if (filePreview) filePreview.innerHTML = '';
    
    // Smooth scroll to list
    const complaintsAnchor = document.getElementById('complaints-section-anchor');
    if (complaintsAnchor) {
      complaintsAnchor.scrollIntoView({ behavior: 'smooth' });
    }
  });

  state.onLanguageChange(() => {
    renderComplaints();
  });

  renderComplaints();
};
