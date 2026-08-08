(function() {
  "use strict";

  /**
   * --------------------------------------------------------------------------
   * Helper Functions
   * --------------------------------------------------------------------------
   */

  function calculateAge(birthDateStr) {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  function calculateTotalExperience(experienceArray) {
    let totalMonths = 0;
    const monthMap = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
    };

    const parseDate = (str) => {
      if (!str) return null;
      if (str.toLowerCase().includes('present')) return new Date();
      const parts = str.trim().split(' ');
      if (parts.length < 2) return null;
      const month = monthMap[parts[0]];
      const year = parseInt(parts[parts.length - 1]);
      return (month === undefined || isNaN(year)) ? null : new Date(year, month, 1);
    };

    experienceArray.forEach((job) => {
      const parts = job.period.split(/[–-]/);
      if (parts.length < 2) return;
      const startDate = parseDate(parts[0].trim());
      const endDate = parseDate(parts[1].trim());
      if (startDate && endDate) {
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                       (endDate.getMonth() - startDate.getMonth());
        totalMonths += Math.max(months, 0);
      }
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    let longText = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
    if (months > 0) longText += (longText ? ' ' : '') + `${months} month${months > 1 ? 's' : ''}`;
    
    return {
      short: years > 0 ? `${years}y${months > 0 ? ' ' + months + 'm' : ''}` : `${months}m`,
      long: longText || '0 months'
    };
  }

  /**
   * --------------------------------------------------------------------------
   * PDF preview support
   * --------------------------------------------------------------------------
   */

  function renderPdfPreviewIntoImage(pdfUrl, imgElement) {
    if (!pdfUrl || !imgElement || !window.pdfjsLib) return;

    const loadingTask = window.pdfjsLib.getDocument(pdfUrl);

    loadingTask.promise.then((pdf) => pdf.getPage(1)).then((page) => {
      const pageScale = 1.75;
      const viewport = page.getViewport({ scale: pageScale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = Math.max(1, Math.round(viewport.width));
      canvas.height = Math.max(1, Math.round(viewport.height));

      return page.render({
        canvasContext: context,
        viewport: viewport
      }).promise.then(() => canvas.toDataURL('image/png'));
    }).then((dataUrl) => {
      const certificateTitle = imgElement.getAttribute('data-cert-title') || '';
      imgElement.src = dataUrl;
      imgElement.alt = certificateTitle;

      const certificateAnchor = imgElement.closest('a.certificate-image-link');
      if (certificateAnchor) {
        certificateAnchor.href = dataUrl;
        certificateAnchor.setAttribute('data-title', certificateTitle);
        certificateAnchor.setAttribute('data-type', 'image');
        certificateAnchor.setAttribute('data-gallery', 'certificate-gallery');
      }
    }).catch(() => {
      const certificateAnchor = imgElement.closest('a.certificate-image-link');
      if (certificateAnchor) {
        certificateAnchor.href = imgElement.getAttribute('data-cert-pdf') || '#';
        certificateAnchor.setAttribute('data-type', 'iframe');
      }
      imgElement.src = '';
      imgElement.alt = 'Certificate preview unavailable';
    });
  }

  function toCertificateTitleFromFilename(filename) {
    const withoutExtension = filename.replace(/\.pdf$/i, '');
    const normalized = withoutExtension
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (ch) => ch.toUpperCase());

    return normalized.trim();
  }

  function getCertificateFiles() {
    const data = window.portfolioData || {};
    const certificateList = Array.isArray(data.certificates) ? data.certificates : [];

    return certificateList
      .map((item) => {
        if (!item || !item.pdf) return null;
        return {
          title: item.title || toCertificateTitleFromFilename(item.pdf.split('/').pop()),
          pdf: item.pdf.replace(/\\/g, '/')
        };
      })
      .filter(Boolean);
  }

  async function renderCertificateGrid() {
    const data = window.portfolioData || {};
    const certRoot = document.getElementById('certificates-root');
    const certSummaryRoot = document.getElementById('cert-summary-root');

    if (!certRoot) return;

    const certificates = getCertificateFiles();

    if (certSummaryRoot) {
      certSummaryRoot.innerHTML = certificates.map((cert) => `
        <div class="cert-item-summary mb-3 d-flex align-items-center p-3" style="background: var(--surface-color); border-radius: 12px; border-left: 4px solid var(--accent-color);">
          <div class="cert-icon me-3">
            <i class="bi bi-award text-accent" style="font-size: 1.5rem; color: var(--accent-color);"></i>
          </div>
          <div class="cert-text">
            <h5 class="mb-0" style="font-size: 1rem; font-weight: 600;">${cert.title}</h5>
          </div>
        </div>
      `).join('');
    }

    const certCount = document.getElementById('cert-count');
    if (certCount) certCount.textContent = String(certificates.length);

    certRoot.innerHTML = certificates.map((c) => `
      <div class="col-lg-4 col-md-6">
        <div class="certificate-item">
          <div class="certificate-image-link">
            <div class="certificate-image-shell">
              <img src="" class="img-fluid certificate-preview" alt="${c.title}" data-cert-pdf="${c.pdf}" data-cert-title="${c.title}">
            </div>
            <div class="certificate-info">
              <h4 class="certificate-title">${c.title}</h4>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    const pdfImages = certRoot.querySelectorAll('[data-cert-pdf]');
    pdfImages.forEach((img) => {
      const pdfPath = img.getAttribute('data-cert-pdf');
      if (pdfPath) {
        renderPdfPreviewIntoImage(pdfPath, img);
      }
    });
  }

  /**
   * --------------------------------------------------------------------------
   * Core Rendering Logic
   * --------------------------------------------------------------------------
   */
  
  function renderPortfolio() {
    const data = window.portfolioData;
    if (!data) return;

    // --- 1. Hero Section ---
    const heroH2 = document.querySelector('#hero h2');
    if (heroH2) heroH2.textContent = `Hi, I'm ${data.shortName || data.name.split(' ')[0]}`;
    
    const typedElement = document.querySelector('.typed');
    if (typedElement) typedElement.setAttribute('data-typed-items', data.hero.typedItems.join(', '));

    // --- 2. About Section ---
    const profileAvatar = document.querySelector('.profile-avatar img');
    if (profileAvatar) profileAvatar.src = data.about.avatar;

    document.querySelectorAll('.profile-header h3').forEach(el => el.textContent = data.name);
    document.querySelectorAll('.profile-header .role').forEach(el => el.textContent = data.role);

    // Stats
    const expVal = calculateTotalExperience(data.experience);
    const ageVal = calculateAge(data.birthDate);
    
    const statAge = document.getElementById('age');
    if (statAge) statAge.textContent = ageVal;
    
    const statExp = document.getElementById('experience');
    if (statExp) statExp.textContent = expVal.short;
    
    const statCert = document.getElementById('cert-count');
    if (statCert) statCert.textContent = data.certificates.length;

    // Bio
    const bioRoot = document.getElementById('bio-root');
    if (bioRoot) {
      bioRoot.innerHTML = `
        <div class="section-tag">${data.about.tag || "About Me"}</div>
        <h2>${data.about.headline}</h2>
        <p>${data.about.bio}</p>
      `;
    }

    // Details Grid
    const detailsRoot = document.getElementById('details-root');
    if (detailsRoot) {
      detailsRoot.innerHTML = data.about.details.map((item, i) => `
        <div class="detail-item">
          <i class="bi ${item.icon}"></i>
          <div class="detail-content">
            <span>${item.label}</span>
            <strong>${item.label === 'Experience' ? expVal.long : item.value}</strong>
          </div>
        </div>
      `).join('');
    }

    // --- 3. Skills Section ---
    const skillsGridRoot = document.getElementById('skills-grid-root');
    if (skillsGridRoot) {
      skillsGridRoot.innerHTML = data.skills.map((cat, i) => `
        <div class="col-lg-3 col-md-6">
          <div class="skill-card">
            <div class="card-icon"><i class="bi ${cat.icon}"></i></div>
            <h3>${cat.category}</h3>
            <div class="skill-list">
              ${cat.items.map((item, j) => `
                <div class="skill-item" style="cursor: pointer;" onclick="window.showSkillDetail(${i}, ${j})">
                  <i class="bi ${item.icon}"></i>
                  <span>${item.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('');
    }

    // Global function to show skill detail modal
    window.showSkillDetail = function(categoryIndex, itemIndex) {
      const item = data.skills[categoryIndex].items[itemIndex];
      const modal = new bootstrap.Modal(document.getElementById('skillModal'));
      
      document.getElementById('modal-icon').className = `bi ${item.icon} me-2`;
      document.getElementById('modal-title-text').textContent = item.name;
      
      const detailsList = document.getElementById('modal-details-list');
      detailsList.innerHTML = item.details.map(detail => `
        <li class="mb-2 d-flex align-items-start">
          <i class="bi bi-check2-circle text-primary me-2 mt-1"></i>
          <span>${detail}</span>
        </li>
      `).join('');
      
      modal.show();
    };

    // --- 4. Resume Section ---
    const expRoot = document.getElementById('experience-root');
    if (expRoot) {
      expRoot.innerHTML = data.experience.map((job, i) => `
        <div class="exp-card featured">
          <div class="card-header">
            <i class="bi bi-briefcase"></i>
            <span class="period-badge">${job.period}</span>
          </div>
          <div class="card-body">
            <h4>${job.title}</h4>
            <p class="company-name">${job.company}</p>
            ${job.description.map(d => `<p>${d}</p>`).join('')}
          </div>
        </div>
      `).join('');
    }

    const eduRoot = document.getElementById('education-root');
    if (eduRoot) {
      // Education Items
      eduRoot.innerHTML = data.education.map(edu => `
        <div class="timeline-item">
          <div class="timeline-marker"><i class="bi bi-mortarboard-fill"></i></div>
          <div class="timeline-content">
            <span class="year-range">${edu.period}</span>
            <h4>${edu.degree}</h4>
            <p class="institution">${edu.institution}</p>
            ${edu.details.map(d => `<p>${d}</p>`).join('')}
          </div>
        </div>
      `).join('');
    }

    const certSummaryRoot = document.getElementById('cert-summary-root');
    if (certSummaryRoot) {
      certSummaryRoot.innerHTML = data.certificates.map(cert => `
        <div class="cert-item-summary mb-3 d-flex align-items-center p-3" style="background: var(--surface-color); border-radius: 12px; border-left: 4px solid var(--accent-color);">
          <div class="cert-icon me-3">
            <i class="bi bi-award text-accent" style="font-size: 1.5rem; color: var(--accent-color);"></i>
          </div>
          <div class="cert-text">
            <h5 class="mb-0" style="font-size: 1rem; font-weight: 600;">${cert.title}</h5>
            <small class="text-muted">${cert.issuer}</small>
          </div>
        </div>
      `).join('');
    }

    // --- 5. Portfolio Section ---
    const portfolioRoot = document.getElementById('portfolio-root');
    if (portfolioRoot) {
      portfolioRoot.innerHTML = data.projects.map(p => `
        <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${p.category}">
          <div class="portfolio-card">
            <div class="face face1">
              <div class="content">
                <img src="${p.image}" alt="${p.title}">
                <h3>${p.title}</h3>
              </div>
            </div>
            <div class="face face2">
              <div class="content">
                <p>${p.description}</p>
                <a href="${p.link}" ${p.type === 'video' || p.type === 'image' ? `class="glightbox" data-gallery="portfolio-gallery" data-type="${p.type}"` : 'target="_blank"'}>
                  ${p.linkText}
                </a>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // --- 5. Certificates Section ---
    const certRoot = document.getElementById('certificates-root');
    if (certRoot) {
      certRoot.innerHTML = data.certificates.map((c) => `
        <div class="col-lg-4 col-md-6">
          <div class="certificate-item">
            <a href="${c.pdf}" class="glightbox certificate-pdf-anchor" data-gallery="certificate-gallery" data-type="iframe">
              <img src="data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='340' height='250' viewBox='0 0 340 250'><rect width='340' height='250' fill='#111827'/><rect x='10' y='10' width='320' height='230' rx='12' fill='none' stroke='#1fbf88' stroke-width='2'/><text x='170' y='118' font-size='20' font-family='Arial' text-anchor='middle' fill='#ffffff'>Certificate</text><text x='170' y='150' font-size='12' font-family='Arial' text-anchor='middle' fill='#a7f3d0'>Preview</text></svg>`)}" class="img-fluid certificate-preview" alt="${c.title}" data-cert-pdf="${c.pdf}">
              <div class="certificate-info">
                <h4>${c.title}</h4>
                <small>${c.issuer}</small>
              </div>
            </a>
          </div>
        </div>
      `).join('');

      const pdfImages = certRoot.querySelectorAll('[data-cert-pdf]');
      pdfImages.forEach((img) => {
        const pdfPath = img.getAttribute('data-cert-pdf');
        if (pdfPath) {
          renderPdfPreviewIntoImage(pdfPath, img);
        }
      });
    }

    // --- 6. Contact Section ---
    const contactRoot = document.getElementById('contact-info-root');
    if (contactRoot) {
      contactRoot.innerHTML = `
        <div class="info-item d-flex align-items-start mb-3">
          <div><h4>Location</h4><p>${data.location}</p></div>
        </div>
        <div class="info-item d-flex align-items-start mb-3">
          <div><h4>Email</h4><p>Contact me via form or at ${data.contact.email}</p></div>
        </div>
        <div class="info-item d-flex align-items-start">
          <div><h4>Call</h4><p>${data.contact.phone}</p></div>
        </div>
      `;
    }

    // --- AI Contact Helper Logic ---
    const promptTemplates = {
      job: {
        subject: "Job Opportunity: [Role Name]",
        message: "Hi Azim, I came across your portfolio and I'm impressed with your background in [Technical Support/Software Dev]. We have an opening for a [Role] at [Company] and would love to discuss how your skills could fit our team."
      },
      collab: {
        subject: "Project Collaboration Proposal",
        message: "Hey Azim, I saw your projects like PhishSecure and the Voice-controlled Music Player. I'm working on something similar related to [Topic] and I was wondering if you'd be interested in collaborating on a new feature?"
      },
      support: {
        subject: "Technical Inquiry / Support Request",
        message: "Hi Azim, I'm reaching out because I need some technical assistance with [System/Network Issue]. Given your experience with ESM support and Network troubleshooting, I thought you'd be the right person to ask."
      },
      hello: {
        subject: "Just saying Hello!",
        message: "Hi Azim, just wanted to drop a message to say I really enjoyed browsing your portfolio. Great work on the interactive tech stack! Let's stay connected."
      }
    };

    const promptButtons = document.querySelectorAll('.btn-prompt');
    const nameInput = document.getElementById('name');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    function updatePrompt(type) {
      const template = promptTemplates[type];
      const name = nameInput.value || "[Your Name]";
      
      // Only update if the user hasn't manually typed something different yet
      // or if they just clicked a prompt button
      subjectInput.value = template.subject;
      let finalMessage = template.message.replace("[Your Name]", name);
      messageInput.value = finalMessage;
    }

    promptButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        promptButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updatePrompt(btn.dataset.type);
      });
    });

    // Initialize with first prompt
    if (promptButtons.length > 0 && !subjectInput.value) {
      updatePrompt('job');
    }

    // Update message if name changes, but only if the message matches a template
    nameInput?.addEventListener('input', () => {
      const activeBtn = document.querySelector('.btn-prompt.active');
      if (activeBtn) {
        const type = activeBtn.dataset.type;
        const name = nameInput.value || "[Your Name]";
        const template = promptTemplates[type];
        
        // If the user hasn't heavily edited the message, keep updating the name part
        if (messageInput.value.includes("Hi Azim") || messageInput.value.includes("Hey Azim")) {
          messageInput.value = template.message.replace("[Your Name]", name);
        }
      }
    });
  }

  /**
   * --------------------------------------------------------------------------
   * Initialization & Event Listeners
   * --------------------------------------------------------------------------
   */

  function init() {
    // Show all sections immediately; remove AOS attributes before any content renders.
    document.querySelectorAll('[data-aos]').forEach((element) => {
      element.getAttributeNames()
        .filter((name) => name.startsWith('data-aos'))
        .forEach((name) => element.removeAttribute(name));
    });

    renderPortfolio();
    renderCertificateGrid();

    // Toggle Mobile Nav
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', function() {
        document.querySelector('body').classList.toggle('mobile-nav-active');
        this.classList.toggle('bi-list');
        this.classList.toggle('bi-x');
      });
    }

    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          document.querySelector('body').classList.remove('mobile-nav-active');
          document.querySelector('.mobile-nav-toggle').classList.toggle('bi-list');
          document.querySelector('.mobile-nav-toggle').classList.toggle('bi-x');
        }
      });
    });

    // Scroll Top
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      const toggleScrollTop = () => {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      };
      window.addEventListener('load', toggleScrollTop);
      document.addEventListener('scroll', toggleScrollTop);
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Preloader
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      window.addEventListener('load', () => preloader.remove());
    }

    // Init Libraries
    window.addEventListener('load', () => {
      // Typed.js
      const typedEl = document.querySelector('.typed');
      if (typedEl && typeof Typed !== 'undefined') {
        let items = typedEl.getAttribute('data-typed-items');
        if (items) {
          new Typed('.typed', { strings: items.split(', '), loop: true, typeSpeed: 100, backSpeed: 50, backDelay: 2000 });
        }
      }

      // GLightbox
      if (typeof GLightbox !== 'undefined') GLightbox({ selector: '.glightbox' });

      // Isotope
      document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
        imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
          let initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
            itemSelector: '.isotope-item',
            layoutMode: 'masonry',
            filter: '*',
            sortBy: 'original-order'
          });

          isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
            filters.addEventListener('click', function() {
              isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
              this.classList.add('filter-active');
              initIsotope.arrange({ filter: this.getAttribute('data-filter') });
            });
          });
        });
      });
    });
  }

  // Header Scroll Effect
  document.addEventListener('scroll', () => {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (selectHeader) {
      window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    }
  });

  // Contact Form Logic (EmailJS Integration)
  document.getElementById('send-message')?.addEventListener('click', function() {
    const btn = this;
    const name = document.getElementById('name').value.trim();
    const emailSender = document.getElementById('email-sender').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !emailSender || !subject || !message) {
      alert('Please fill in all fields, including your email address.');
      return;
    }

    // Update button state
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';

    // Note: Ensure these keys match the {{tag_names}} in your EmailJS Template!
    const templateParams = {
      user_name: name,
      user_email: emailSender,
      user_subject: subject,
      message: message
    };

    emailjs.send("service_u5dofgs", "template_nujzwyg", templateParams)
      .then(function(response) {
        alert('Message sent successfully! Azim will get back to you soon.');
        document.getElementById('contact-form').reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        if (typeof window.updatePrompt === 'function') window.updatePrompt('job');
      }, function(error) {
        // This will now show the exact error from EmailJS
        alert('Failed to send: ' + (error.text || error.message || 'Unknown Error') + '. Please check your Service/Template IDs.');
        btn.disabled = false;
        btn.innerHTML = originalText;
      });
  });

  // Run
  init();

})();
