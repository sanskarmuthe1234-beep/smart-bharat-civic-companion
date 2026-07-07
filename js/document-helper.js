window.SmartBharat = window.SmartBharat || {};

window.SmartBharat.initDocumentHelper = function(state) {
  const SCHEMES = window.SmartBharat.SCHEMES;
  const LOCALIZATION = window.SmartBharat.LOCALIZATION;
  const DOC_VERIFICATION_CRITERIA = window.SmartBharat.DOC_VERIFICATION_CRITERIA;

  const schemeSelect = document.getElementById('doc-scheme-select');
  const checklistContainer = document.getElementById('doc-checklist');
  const dropZone = document.getElementById('ocr-dropzone');
  const fileInput = document.getElementById('ocr-file-input');
  const logsContainer = document.getElementById('ocr-logs');
  const statusContainer = document.getElementById('ocr-status-result');
  const simulatedTextEl = document.getElementById('ocr-simulated-text');

  if (!schemeSelect || !checklistContainer || !dropZone || !fileInput || !logsContainer || !statusContainer || !simulatedTextEl) return;

  // Populate scheme select options
  function populateSchemes() {
    schemeSelect.innerHTML = `<option value="">-- Choose a Scheme / Service --</option>`;
    SCHEMES.forEach(scheme => {
      const opt = document.createElement('option');
      opt.value = scheme.id;
      opt.innerText = scheme.name;
      schemeSelect.appendChild(opt);
    });
  }

  // Render checklist when scheme is selected
  schemeSelect.addEventListener('change', () => {
    const schemeId = schemeSelect.value;
    checklistContainer.innerHTML = '';
    
    if (!schemeId) return;

    const scheme = SCHEMES.find(s => s.id === schemeId);
    if (!scheme) return;

    const listTitle = document.createElement('h3');
    listTitle.innerText = `Required Checklist for ${scheme.name}:`;
    checklistContainer.appendChild(listTitle);

    const ul = document.createElement('ul');
    ul.className = 'document-checklist-items';
    scheme.documents.forEach(doc => {
      // Find if we have OCR criteria for this doc
      let ocrKey = '';
      if (doc.toLowerCase().includes('aadhaar')) ocrKey = 'aadhaar';
      else if (doc.toLowerCase().includes('pan')) ocrKey = 'pan';
      else if (doc.toLowerCase().includes('ration')) ocrKey = 'ration';
      else if (doc.toLowerCase().includes('income')) ocrKey = 'income';

      const li = document.createElement('li');
      li.innerHTML = `
        <label class="doc-chk-label">
          <input type="checkbox" class="doc-chk">
          <span class="doc-chk-text">${doc}</span>
        </label>
        ${ocrKey ? `<button class="inline-verify-btn" data-ocr-key="${ocrKey}">Verify with AI Scanner</button>` : ''}
      `;

      if (ocrKey) {
        li.querySelector('.inline-verify-btn').addEventListener('click', () => {
          // Highlight upload zone
          dropZone.scrollIntoView({ behavior: 'smooth' });
          dropZone.classList.add('pulse-highlight');
          setTimeout(() => dropZone.classList.remove('pulse-highlight'), 1500);

          // Focus simulated text for that card
          let placeholder = "1234 5678 9012";
          if (ocrKey === 'pan') placeholder = "ABCDE1234F";
          else if (ocrKey === 'ration') placeholder = "RATION-NFSA-82736412";
          else if (ocrKey === 'income') placeholder = "Rs. 1,15,000 Certified income";

          simulatedTextEl.placeholder = `E.g., "${placeholder}" to match ${DOC_VERIFICATION_CRITERIA[ocrKey].name}...`;
        });
      }

      ul.appendChild(li);
    });
    checklistContainer.appendChild(ul);
  });

  // Drag and drop events
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleDocumentUpload(files[0]);
    }
  });

  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleDocumentUpload(fileInput.files[0]);
    }
  });

  function addLog(text, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        const p = document.createElement('p');
        p.innerText = `[${new Date().toLocaleTimeString()}] ${text}`;
        logsContainer.appendChild(p);
        logsContainer.scrollTop = logsContainer.scrollHeight;
        resolve();
      }, delay);
    });
  }

  async function handleDocumentUpload(file) {
    logsContainer.innerHTML = '';
    statusContainer.innerHTML = '';
    logsContainer.style.display = 'block';

    const simulatedText = simulatedTextEl.value.trim() || file.name;

    await addLog(`Initializing BharatOCR Gateway connection...`, 100);
    await addLog(`Uploading file: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)...`, 500);
    await addLog(`Scanning layout structure and boundaries...`, 600);
    await addLog(`Running localized layout orientation filters...`, 500);
    await addLog(`Extracting alphanumeric characters via Deep OCR Model...`, 800);
    await addLog(`Raw text extracted: "${simulatedText}"`, 600);
    await addLog(`Comparing text against verification templates...`, 700);

    // Evaluate OCR criteria
    let matchedDocKey = null;
    const txtLower = simulatedText.toLowerCase();

    // Check if filename or text matches any document key
    if (txtLower.includes("aadhaar") || txtLower.includes("adhar") || /\d{4}\s\d{4}\s\d{4}/.test(simulatedText)) {
      matchedDocKey = "aadhaar";
    } else if (txtLower.includes("pan") || txtLower.includes("pancard") || /[A-Z]{5}\d{4}[A-Z]{1}/.test(simulatedText)) {
      matchedDocKey = "pan";
    } else if (txtLower.includes("ration") || txtLower.includes("security") || txtLower.includes("food")) {
      matchedDocKey = "ration";
    } else if (txtLower.includes("income") || txtLower.includes("tehsildar") || txtLower.includes("rs.") || txtLower.includes("₹")) {
      matchedDocKey = "income";
    }

    if (!matchedDocKey) {
      await addLog(`❌ Verification failed: Document type could not be confidently identified.`, 300);
      statusContainer.innerHTML = `
        <div class="ocr-result-alert alert-error">
          <h4>❌ OCR Verification Failed</h4>
          <p>We could not match this upload to any official format. Please type details in the preview box or ensure file name matches the document card (e.g. 'aadhaar.jpg').</p>
        </div>
      `;
      return;
    }

    const criteria = DOC_VERIFICATION_CRITERIA[matchedDocKey];
    await addLog(`Identified Document Type: ${criteria.name}`, 300);

    // Validate structural requirements
    let hasMustContain = criteria.mustContain.some(word => txtLower.includes(word.toLowerCase()));
    let hasRegex = criteria.formatRegex.test(simulatedText);

    // For simulation, let's pass if either formatting matches or keywords match
    if (hasRegex || hasMustContain) {
      await addLog(`✅ Structural validation passed for ${criteria.name}.`, 300);
      await addLog(`OCR Verification Summary: SUCCESS.`, 200);

      statusContainer.innerHTML = `
        <div class="ocr-result-alert alert-success">
          <h4>✅ OCR Verification Successful</h4>
          <p><strong>Document Recognized:</strong> ${criteria.name}</p>
          <p><strong>Verified Details:</strong> Found valid layout identifiers and serial key structure.</p>
        </div>
      `;

      // Automatically check off this document in the checklist if it exists
      const checkBoxes = checklistContainer.querySelectorAll('.doc-chk-text');
      checkBoxes.forEach(span => {
        if (span.innerText.toLowerCase().includes(matchedDocKey.replace('aadhaar', 'adhar')) || 
            span.innerText.toLowerCase().includes(matchedDocKey)) {
          const chk = span.previousElementSibling || span.parentElement.querySelector('input');
          if (chk) chk.checked = true;
        }
      });

    } else {
      await addLog(`⚠️ Verification warning: Found ${criteria.name} layout but identifier key format is incorrect.`, 300);
      await addLog(`Details: ${criteria.sampleError}`, 200);

      statusContainer.innerHTML = `
        <div class="ocr-result-alert alert-warning">
          <h4>⚠️ Formatting Issue Detected</h4>
          <p><strong>Document Recognized:</strong> ${criteria.name}</p>
          <p><strong>Issue:</strong> ${criteria.sampleError}</p>
          <p><em>Please review document orientation or try entering credentials correctly.</em></p>
        </div>
      `;
    }
  }

  state.onLanguageChange(() => {
    populateSchemes();
  });

  populateSchemes();
};
