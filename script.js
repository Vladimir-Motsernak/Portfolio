// ===== WAIT FOR DOM TO LOAD =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== MOBILE MENU TOGGLE =====
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const menuIcon = mobileMenuToggle ? mobileMenuToggle.querySelector('i') : null;

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');

      // Toggle icon between bars (≡) and times (×)
      if (menuIcon) {
        if (navLinks.classList.contains('active')) {
          menuIcon.classList.replace('fa-bars', 'fa-times');
        } else {
          menuIcon.classList.replace('fa-times', 'fa-bars');
        }
      }
    });

    // Close menu when clicking a nav link
    const navLinkItems = navLinks.querySelectorAll('a');
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuIcon) {
          menuIcon.classList.replace('fa-times', 'fa-bars');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        if (menuIcon) {
          menuIcon.classList.replace('fa-times', 'fa-bars');
        }
      }
    });
  }

  // ===== THEME TOGGLE FUNCTIONALITY =====
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

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
  const typewriter = document.getElementById("typewriter");

  if (typewriter) {
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
  const sections = document.querySelectorAll('section');
  const navLinkElements = document.querySelectorAll('.nav-links a');

  if (sections.length && navLinkElements.length) {
    window.addEventListener('scroll', () => {
      let current = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 100)) {
          current = section.getAttribute('id');
        }
      });

      navLinkElements.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.slice(1) === current) {
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
        
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 60,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===== SKILLS PROGRESS BARS ANIMATION =====
  const skillProgressBars = document.querySelectorAll('.skill-progress');

  if (skillProgressBars.length && 'IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.5
    };

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
  }

  // ===== CONTACT FORM HANDLING =====
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get form data
      const formData = {
        name: document.getElementById('name')?.value || '',
        email: document.getElementById('email')?.value || '',
        subject: document.getElementById('subject')?.value || '',
        message: document.getElementById('message')?.value || ''
      };

      // Disable submit button
      const submitBtn = contactForm.querySelector('.submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }

      try {
        // Replace with your FormSpree endpoint
        const response = await fetch('https://formspree.io/f/xeovjora', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (response.ok) {
          if (formMessage) {
            formMessage.textContent = 'Thank you! Your message has been sent successfully.';
            formMessage.className = 'form-message success';
          }

          // Reset form
          contactForm.reset();

          // Hide message after 5 seconds
          if (formMessage) {
            setTimeout(() => {
              formMessage.style.display = 'none';
            }, 5000);
          }
        } else {
          throw new Error('Form submission failed');
        }

      } catch (error) {
        if (formMessage) {
          formMessage.textContent = 'Sorry, there was an error sending your message. Please try again or email me directly.';
          formMessage.className = 'form-message error';
        }
        console.error('Contact form error:', error);
      } finally {
        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
      }
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const fadeElements = document.querySelectorAll('.project-item, .info-card, .contact-info-item');
  
  if (fadeElements.length && 'IntersectionObserver' in window) {
    const fadeObserverOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
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
  }

});

