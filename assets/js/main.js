(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 100,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

// CV Download Functionality
document.getElementById('download-cv').addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default link behavior

  // Set the file URL and filename
  const fileUrl = 'assets/cv/CV_Muhammad_Azim.pdf'; // Path to your CV file
  const fileName = 'CV_Muhammad_Azim.pdf'; // Desired download filename

  // Create a temporary <a> element
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;

  // Append the <a> to the body, trigger the click, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Contact Form Functionality
document.getElementById('send-message').addEventListener('click', function () {
  const name = document.getElementById('name').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !subject || !message) {
    alert('Please fill in all fields before sending.');
    return;
  }

  // Create a letter-style body
  const body = 
`Dear Azim,

${message}

From,
${name}`;

  // Construct Gmail link
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=muhdazimm21@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const confirmSend = confirm(
    "Gmail will open in a new tab with your message pre-filled.\n\nClick OK to continue."
  );

  if (confirmSend) {
    window.open(gmailLink, '_blank');
  }
});


// Dynamic Age Calculation
document.addEventListener('DOMContentLoaded', function () {
  const birthDate = new Date('2001-06-21'); // Replace with your birthdate (YYYY-MM-DD)
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();

  // Check if the birthday has not occurred yet this year
  const hasBirthdayPassed = today.getMonth() > birthDate.getMonth() || 
                            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasBirthdayPassed) {
    age -= 1;
  }

  // Set the calculated age in the HTML
  document.getElementById('age').textContent = age;
});

// Dynamic Experience Calculation
document.addEventListener('DOMContentLoaded', function () {
  const periodBadges = document.querySelectorAll('.period-badge');
  let totalMonths = 0;

  const parseDate = (str) => {
    if (str === 'Present') return new Date();
    const [month, year] = str.split(' ');
    return new Date(`${year}-${month}-01`);
  };

  periodBadges.forEach((badge) => {
    const periodText = badge.textContent.trim();
    const [start, end] = periodText.split(' - ');

    const startDate = parseDate(start);
    const endDate = parseDate(end);

    if (isNaN(startDate) || isNaN(endDate)) return; // skip invalid

    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());
    totalMonths += months;
  });

  const experienceText = totalMonths < 12
    ? `${totalMonths} Months`
    : `${Math.floor(totalMonths / 12)} Year${Math.floor(totalMonths / 12) > 1 ? 's' : ''}`;

  document.getElementById('experience').textContent = totalMonths < 12 ? totalMonths : Math.floor(totalMonths / 12);
  document.getElementById('experience-label').textContent = totalMonths < 12 ? 'Months' : 'Years';
  document.getElementById('details-experience').textContent = experienceText;
});
