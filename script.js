// ===== SAFE DOM LOADING & DEFENSIVE CHECKS =====
document.addEventListener('DOMContentLoaded', () => {
  // Helper: safe query
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ===== MOBILE MENU TOGGLE =====
  const mobileMenuToggle = $('#mobile-menu-toggle');
  const navLinks = $('#nav-links');
  const menuIcon = mobileMenuToggle ? mobileMenuToggle.querySelector('i') : null;

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');

      // Toggle icon between bars and times (guard icon existence)
      if (menuIcon) {
        if (navLinks.classList.contains('active')) {
          menuIcon.classList.replace('fa-bars', 'fa-times');
        } else {
          menuIcon.classList.replace('fa-times', 'fa-bars');
        }
      }
    });
  }

  // Close menu when a link is clicked
  const navLinksAnchors = $$('.nav-links a');
  if (navLinksAnchors.length && navLinks && menuIcon) {
    navLinksAnchors.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuIcon.classList.replace('fa-times', 'fa-bars');
      });
    });
  }

  // ===== THEME TOGGLE FUNCTIONALITY =====
  const themeToggle = $('#theme-toggle');
  const body = document.body;
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  // Only perform theme logic if element exists
  if (themeToggle) {
    // Check for saved theme preference or default to 'light' mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);

    // Update icon based on current theme
    if (currentTheme === 'dark' && themeIcon) {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
      const theme = body.getAttribute('data-theme');

      if (theme === 'light') {
        body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
      } else {
        body.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ===== TYPEWRITER EFFECT =====
  const roles = [
    "A Student",
    "A Web Developer",
    "A Designer"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let typing = true;
  const typewriter = $('#typewriter');

  if (typewriter && roles.length) {
    function type() {
      if (typing) {
        if (charIndex < roles[roleIndex].length) {
          typewriter.textContent += roles[roleIndex][charIndex++];
          setTimeout(type, 80);
        } else {
          typing = false;
          setTimeout(erase, 2000);
        }
      }
    }

    function erase() {
      if (!typing) {
        if (charIndex > 0) {
          typewriter.textContent = roles[roleIndex].substring(0, --charIndex);
          setTimeout(erase, 40);
        } else {
          typing = true;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(type, 400);
        }
      }
    }

    // Start typewriter effect
    type();
  }

  // ===== NAVIGATION ACTIVE STATE =====
  const sections = $$('section');
  // make selector consistent with other code
  const navLinkElements = $$('.nav-links a');

  if (sections.length && navLinkElements.length) {
    window.addEventListener('scroll', () => {
      let current = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 100)) {
          current = section.getAttribute('id');
        }
      });

      navLinkElements.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') && link.getAttribute('href').slice(1) === current) {
          link.classList.add('active');
        }
      });
    });
  }

  // ===== SMOOTH SCROLLING =====
  if (navLinkElements.length) {
    navLinkElements.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        e.preventDefault();
        const targetId = href.slice(1);
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        window.scrollTo({
          top: targetSection.offsetTop - 60,
          behavior: 'smooth'
        });
      });
    });
  }

  // ===== SKILLS PROGRESS BARS ANIMATION =====
  const skillProgressBars = $$('.skill-progress');

  if (skillProgressBars.length) {
    const observerOptions = {
      threshold: 0.5
    };

    if ('IntersectionObserver' in window) {
      const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const progressBar = entry.target;
            const progress = progressBar.getAttribute('data-progress') || '0';
            progressBar.style.width = progress + '%';
            skillObserver.unobserve(progressBar);
          }
        });
      }, observerOptions);

      skillProgressBars.forEach(bar => {
        skillObserver.observe(bar);
      });
    } else {
      // Fallback: immediately set widths
      skillProgressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress') || '0';
        bar.style.width = progress + '%';
      });
    }
  }

  // ===== CONTACT FORM HANDLING =====
  const contactForm = $('#contact-form');
  const formMessage = $('#form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get form data (guard each field)
      const nameEl = $('#name');
      const emailEl = $('#email');
      const subjectEl = $('#subject');
      const messageEl = $('#message');

      const formData = {
        name: nameEl ? nameEl.value : '',
        email: emailEl ? emailEl.value : '',
        subject: subjectEl ? subjectEl.value : '',
        message: messageEl ? messageEl.value : ''
      };

      // Disable submit button
      const submitBtn = contactForm.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }

      try {
        const response = await fetch('https://formspree.io/f/xeovjora', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        // small artificial delay to improve UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (formMessage) {
          formMessage.textContent = 'Thank you! Your message has been sent successfully.';
          formMessage.className = 'form-message success';
          formMessage.style.display = ''; // reset any inline style none
        }

        // Reset form
        contactForm.reset();

        // Hide message after 5 seconds
        if (formMessage) {
          setTimeout(() => {
            formMessage.style.display = 'none';
          }, 5000);
        }
      } catch (error) {
        if (formMessage) {
          formMessage.textContent = 'Sorry, there was an error sending your message. Please try again or email me directly.';
          formMessage.className = 'form-message error';
          formMessage.style.display = '';
        }
        // Optionally log error to console for debugging
        console.error('Contact form submit error:', error);
      } finally {
        // Re-enable submit button
        const submitBtn2 = contactForm.querySelector('.submit-btn');
        if (submitBtn2) {
          submitBtn2.disabled = false;
          submitBtn2.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
      }
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const fadeElements = $$('.project-item, .info-card, .contact-info-item');
  if (fadeElements.length) {
    const fadeObserverOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    if ('IntersectionObserver' in window) {
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Optionally unobserve to improve perf
            fadeObserver.unobserve(entry.target);
          }
        });
      }, fadeObserverOptions);

      fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
      });
    } else {
      // Fallback: apply visible styles immediately
      fadeElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }
});
