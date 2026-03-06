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
        <div class="detail-item" data-aos="fade-up" data-aos-delay="${100 + (i * 50)}">
          <i class="bi ${item.icon}"></i>
          <div class="detail-content">
            <span>${item.label}</span>
            <strong>${item.label === 'Experience' ? expVal.long : item.value}</strong>
          </div>
        </div>
      `).join('');
    }

    // --- 3. Resume Section ---
    const expRoot = document.getElementById('experience-root');
    if (expRoot) {
      expRoot.innerHTML = data.experience.map((job, i) => `
        <div class="exp-card featured" data-aos="zoom-in" data-aos-delay="${300 + (i * 100)}">
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
      const eduHTML = data.education.map(edu => `
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

      // Skills Item (Appended to Education Timeline)
      const skillsHTML = `
        <div class="timeline-item">
          <div class="timeline-marker"><i class="bi bi-patch-check-fill"></i></div>
          <div class="timeline-content">
            <h4>Skills</h4>
            <div class="skills-section">
              ${Object.entries(data.skills).map(([cat, list]) => `
                <h5 class="skill-category">${cat}</h5>
                <ul class="certifications-list">
                  ${list.map(s => `<li>${s}</li>`).join('')}
                </ul>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      eduRoot.innerHTML = eduHTML + skillsHTML;
    }

    // --- 4. Portfolio Section ---
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
      certRoot.innerHTML = data.certificates.map(c => `
        <div class="col-lg-4 col-md-6">
          <div class="certificate-item">
            <a href="${c.image}" class="glightbox" data-gallery="certificate-gallery">
              <img src="${c.image}" class="img-fluid" alt="${c.title}">
              <div class="certificate-info">
                <h4>${c.title}</h4>
                <small>${c.issuer}</small>
              </div>
            </a>
          </div>
        </div>
      `).join('');
    }

    // --- 6. Contact Section ---
    const contactRoot = document.getElementById('contact-info-root');
    if (contactRoot) {
      contactRoot.innerHTML = `
        <div class="info-item d-flex align-items-start mb-3">
          <div><h4>Location</h4><p>${data.location}</p></div>
        </div>
        <div class="info-item d-flex align-items-start mb-3">
          <div><h4>Email</h4><p>${data.contact.email}</p></div>
        </div>
        <div class="info-item d-flex align-items-start">
          <div><h4>Call</h4><p>${data.contact.phone}</p></div>
        </div>
      `;
    }
    
    // Update "Contact Me" Gmail Button in Profile Card
    const gmailBtn = document.getElementById('contact-gmail');
    if (gmailBtn) {
      gmailBtn.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${data.contact.email}&su=Job%20Opportunity`;
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Initialization & Event Listeners
   * --------------------------------------------------------------------------
   */

  function init() {
    renderPortfolio();

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
      // AOS
      if (typeof AOS !== 'undefined') AOS.init({ duration: 600, easing: 'ease-in-out', once: true });
      
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
              if (typeof AOS !== 'undefined') AOS.refresh();
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

  // Contact Form Logic (Mailto fallback)
  document.getElementById('send-message')?.addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const email = window.portfolioData?.contact?.email;

    if (!name || !subject || !message) {
      alert('Please fill in all fields.');
      return;
    }
    
    if (confirm("This will open your default email client. Continue?")) {
      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + "\n\n" + message)}`);
    }
  });

  // Run
  init();

})();