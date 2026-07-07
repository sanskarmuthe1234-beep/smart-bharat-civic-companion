window.SmartBharat = window.SmartBharat || {};

window.SmartBharat.initSchemeRecommender = function(state) {
  const SCHEMES = window.SmartBharat.SCHEMES;
  const LOCALIZATION = window.SmartBharat.LOCALIZATION;

  const form = document.getElementById('recommender-form');
  const resultsContainer = document.getElementById('recommender-results');
  const resultsTitle = document.getElementById('recommender-results-title');

  if (!form || !resultsContainer || !resultsTitle) return;

  function evaluateSchemes(profile) {
    return SCHEMES.filter(scheme => {
      const elig = scheme.eligibility;

      // Age constraint
      if (profile.age < elig.minAge || profile.age > elig.maxAge) {
        return false;
      }

      // Income constraint (if profile has income and scheme specifies maxIncome)
      if (elig.maxIncome !== undefined && profile.income > elig.maxIncome) {
        return false;
      }

      // Occupation constraint
      if (elig.occupations && elig.occupations.length > 0 && !elig.occupations.includes("All")) {
        if (!elig.occupations.includes(profile.occupation)) {
          return false;
        }
      }

      return true;
    });
  }

  function renderResults(matches) {
    const lang = state.lang || 'en';
    resultsContainer.innerHTML = '';
    
    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results-card">
          <p>${LOCALIZATION[lang].no_results}</p>
        </div>
      `;
      return;
    }

    matches.forEach(scheme => {
      const card = document.createElement('div');
      card.className = 'scheme-card fade-in';
      
      let benefitsHTML = scheme.benefits.map(b => `<li>${b}</li>`).join('');
      let docsHTML = scheme.documents.map(d => `<span>📄 ${d}</span>`).join(' ');

      card.innerHTML = `
        <div class="scheme-header">
          <span class="scheme-category-badge">${scheme.category}</span>
          <span class="scheme-ministry">${scheme.ministry}</span>
        </div>
        <h3 class="scheme-title">${scheme.name}</h3>
        <p class="scheme-desc">${scheme.description}</p>
        
        <div class="scheme-details">
          <h4>Key Benefits:</h4>
          <ul>${benefitsHTML}</ul>
        </div>

        <div class="scheme-docs">
          <h4>Required Documents:</h4>
          <div class="docs-tag-container">${docsHTML}</div>
        </div>

        <div class="scheme-actions">
          <button class="primary-btn check-docs-btn" data-scheme-id="${scheme.id}">Verify Documents</button>
          <a href="#" class="secondary-btn apply-btn-mock">Apply Online (External)</a>
        </div>
      `;

      // Set listener to redirect to Document Helper and select this scheme
      card.querySelector('.check-docs-btn').addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-scheme-id');
        // Switch page to Document Helper
        state.setCurrentPage('docs');
        
        // Select the scheme in Document Helper selectbox
        setTimeout(() => {
          const select = document.getElementById('doc-scheme-select');
          if (select) {
            select.value = id;
            select.dispatchEvent(new Event('change'));
          }
        }, 100);
      });

      resultsContainer.appendChild(card);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const age = parseInt(document.getElementById('profile-age').value) || 0;
    const income = parseFloat(document.getElementById('profile-income').value) || 0;
    const occupation = document.getElementById('profile-occupation').value;
    const stateVal = document.getElementById('profile-state').value;
    const gender = document.getElementById('profile-gender').value;

    const profile = { age, income, occupation, stateVal, gender };
    const matches = evaluateSchemes(profile);

    resultsTitle.style.display = 'block';
    renderResults(matches);
    
    // Smooth scroll to results
    resultsTitle.scrollIntoView({ behavior: 'smooth' });
  });

  state.onLanguageChange(() => {
    // Retranslate static form placeholders and labels if needed
    const age = parseInt(document.getElementById('profile-age').value) || 0;
    const income = parseFloat(document.getElementById('profile-income').value) || 0;
    const occupation = document.getElementById('profile-occupation').value;
    const stateVal = document.getElementById('profile-state').value;
    const gender = document.getElementById('profile-gender').value;
    
    if (age || income) {
      const profile = { age, income, occupation, stateVal, gender };
      const matches = evaluateSchemes(profile);
      renderResults(matches);
    }
  });
};
