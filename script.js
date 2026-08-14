/* ========================================
   NEERA RAJ MAKEUP ARTIST - LANDING PAGE JS
   Animations, Interactions & Form Handling
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========== NAVBAR SCROLL EFFECT ==========
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavbarScroll() {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });


  // ========== MOBILE MENU ==========
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  // ========== SMOOTH SCROLLING ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.hasAttribute('data-open-lead')) return;
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // ========== HERO SPARKLE PARTICLES ==========
  const heroParticles = document.getElementById('heroParticles');
  
  function createSparkles() {
    // Only create sparkles on screens wide enough
    if (window.innerWidth < 768) return;

    const count = 20;
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle');
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 4}s`;
      sparkle.style.animationDuration = `${3 + Math.random() * 3}s`;
      sparkle.style.width = `${2 + Math.random() * 4}px`;
      sparkle.style.height = sparkle.style.width;
      heroParticles.appendChild(sparkle);
    }
  }

  createSparkles();


  // ========== SCROLL REVEAL (IntersectionObserver) ==========
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Optional: Stop observing after reveal for performance
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }


  // ========== COUNTER ANIMATION ==========
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // ms
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;
      const increment = target / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, stepTime);
    });

    countersAnimated = true;
  }

  // Observe the stats bar
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.unobserve(statsBar);
      }
    }, { threshold: 0.5 });

    statsObserver.observe(statsBar);
  }


  // ========== TESTIMONIALS SLIDER ==========
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.testimonial-card').length;
  let autoSlideInterval;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    
    currentSlide = index;
    testimonialsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    resetAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    resetAutoSlide();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.getAttribute('data-index')));
      resetAutoSlide();
    });
  });

  // Touch/swipe support for testimonials slider
  let touchStartX = 0;
  let touchEndX = 0;

  testimonialsTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  testimonialsTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
      resetAutoSlide();
    }
  }, { passive: true });

  startAutoSlide();


  // ========== PORTFOLIO LIGHTBOX ==========
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const portfolioItems = document.querySelectorAll('[data-lightbox]');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });


  // ========== FAST AVAILABILITY MODAL ==========
  const leadModal = document.getElementById('leadModal');
  const leadModalClose = document.getElementById('leadModalClose');

  document.querySelectorAll('[data-open-lead]').forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      if (!leadModal || typeof leadModal.showModal !== 'function') return;
      event.preventDefault();
      leadModal.showModal();
      document.body.classList.add('modal-open');
    });
  });

  function closeLeadModal() {
    if (!leadModal) return;
    leadModal.close();
    document.body.classList.remove('modal-open');
  }

  leadModalClose?.addEventListener('click', closeLeadModal);
  leadModal?.addEventListener('click', (event) => {
    if (event.target === leadModal) closeLeadModal();
  });
  leadModal?.addEventListener('close', () => document.body.classList.remove('modal-open'));


  // ========== QUERY FORM HANDLING ==========
  const queryForm = document.getElementById('queryForm');
  const quickLeadForm = document.getElementById('quickLeadForm');
  const formSubmitBtn = document.getElementById('formSubmitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const leadEndpoint = 'https://script.google.com/macros/s/AKfycbxORd57P7CNUhsdIttMLwqothScHGKidaDLzV3ox08d7SxQl44miquYCnic5rEuHqmrtw/exec';

  async function handleLeadSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const serviceSelect = form.querySelector('[name="service"]');
    const serviceLabel = serviceSelect?.selectedOptions?.[0]?.text || 'Bridal makeup';
    const submitButton = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    const urlParams = new URLSearchParams(window.location.search);
    const leadPayload = new URLSearchParams({
      fullName: data.get('fullName') || '',
      phone: data.get('phone') || '',
      email: data.get('email') || '',
      weddingDate: data.get('weddingDate') || '',
      weddingVenue: data.get('weddingVenue') || '',
      service: serviceLabel,
      message: data.get('message') || '',
      leadSource: urlParams.get('utm_source') || 'Landing Page',
      campaign: urlParams.get('utm_campaign') || '',
      adSet: urlParams.get('utm_term') || urlParams.get('adset') || '',
      ad: urlParams.get('utm_content') || urlParams.get('ad') || '',
      pageUrl: window.location.href
    });
    const message = [
      'Hello Neera, I would like to check bridal makeup availability.',
      `Name: ${data.get('fullName') || ''}`,
      `WhatsApp: ${data.get('phone') || ''}`,
      `Wedding date: ${data.get('weddingDate') || ''}`,
      `Wedding city/destination: ${data.get('weddingVenue') || ''}`,
      `Service: ${serviceLabel}`
    ].join('\n');

    submitButton.disabled = true;
    submitButton.classList.add('loading');
    if (status) status.textContent = 'Saving your inquiry…';

    try {
      await fetch(leadEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: leadPayload
      });

    } catch (error) {
      submitButton.disabled = false;
      submitButton.classList.remove('loading');
      if (status) status.textContent = 'We could not save your inquiry. Please check your connection and try again.';
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
    } catch (error) {
      // Clipboard access is optional; the lead has already been saved.
    }

    submitButton.classList.remove('loading');
    if (form === queryForm) {
      queryForm.style.display = 'none';
      formSuccess.classList.add('show');
    } else {
      status.innerHTML = 'Thank you—your inquiry has been saved. Neera\'s team will contact you about your date. <a href="https://ig.me/m/neera_makeupartistry" target="_blank" rel="noopener noreferrer">Message on Instagram →</a>';
      form.reset();
    }

    window.dispatchEvent(new CustomEvent('neera:lead', { detail: { source: form.id } }));
  }

  queryForm?.addEventListener('submit', handleLeadSubmit);
  quickLeadForm?.addEventListener('submit', handleLeadSubmit);


  // ========== ACTIVE NAV LINK ON SCROLL ==========
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveNavLink() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

      if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });


  // ========== PARALLAX EFFECT ON HERO ==========
  const heroBg = document.querySelector('.hero-bg img');
  
  function handleParallax() {
    if (window.innerWidth < 768) return; // Disable on mobile
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });


  // ========== WEDDING DATE MIN DATE ==========
  const weddingDateInputs = document.querySelectorAll('input[type="date"]');
  if (weddingDateInputs.length) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    weddingDateInputs.forEach(input => input.setAttribute('min', `${yyyy}-${mm}-${dd}`));
  }

  // ========== FIXED BOTTOM BAR - SHOW AFTER HERO ==========
  const fixedBottomBar = document.querySelector('.fixed-bottom-bar');
  const heroSection = document.getElementById('hero');

  if (fixedBottomBar && heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Hero is visible — hide the bar
          fixedBottomBar.classList.remove('visible');
        } else {
          // Hero scrolled away — show the bar
          fixedBottomBar.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });

    heroObserver.observe(heroSection);
  }


  // ========== REMOVE INJECTED SCROLL-TO-TOP BUTTONS ==========
  // Some hosting platforms / browsers inject a scroll-to-top button.
  // This removes them on load and watches for dynamically injected ones.
  function removeScrollToTop() {
    const selectors = [
      '[class*="scroll-to-top"]',
      '[class*="back-to-top"]',
      '[class*="scrolltop"]',
      '[class*="ScrollTop"]',
      '[id*="scroll-to-top"]',
      '[id*="back-to-top"]',
      'a[href="#top"]',
      'button[aria-label="Scroll to top"]'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
  }

  removeScrollToTop();

  // Watch for dynamically injected elements
  const bodyObserver = new MutationObserver(() => {
    removeScrollToTop();
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });

});
