// ===== THEME TOGGLE FUNCTIONALITY =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to 'light' mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
if (currentTheme === 'dark') {
  themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  const theme = body.getAttribute('data-theme');
  
  if (theme === 'light') {
    body.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    body.setAttribute('data-theme', 'light');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
});

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

// ===== NAVIGATION ACTIVE STATE =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav .nav-links li a');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 100)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// ===== SMOOTH SCROLLING =====
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').slice(1);
    const targetSection = document.getElementById(targetId);
    
    window.scrollTo({
      top: targetSection.offsetTop - 60,
      behavior: 'smooth'
    });
  });
});

// ===== SKILLS PROGRESS BARS ANIMATION =====
const skillProgressBars = document.querySelectorAll('.skill-progress');

const observerOptions = {
  threshold: 0.5
};

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBar = entry.target;
      const progress = progressBar.getAttribute('data-progress');
      progressBar.style.width = progress + '%';
      skillObserver.unobserve(progressBar);
    }
  });
}, observerOptions);

skillProgressBars.forEach(bar => {
  skillObserver.observe(bar);
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };
  
  // Disable submit button
  const submitBtn = contactForm.querySelector('.submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  
  try {
    
    const response = await fetch('https://formspree.io/f/xeovjora', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
   
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    formMessage.textContent = 'Thank you! Your message has been sent successfully.';
    formMessage.className = 'form-message success';
    
    // Reset form
    contactForm.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
    
  } catch (error) {
    // Show error message
    formMessage.textContent = 'Sorry, there was an error sending your message. Please try again or email me directly.';
    formMessage.className = 'form-message error';
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  }
});

// ===== THREE.JS ANIMATED PARTICLE BACKGROUND =====
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 50;

// Create particles
const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 100;
  positions[i + 1] = (Math.random() - 0.5) * 100;
  positions[i + 2] = (Math.random() - 0.5) * 100;
  
  velocities[i] = (Math.random() - 0.5) * 0.02;
  velocities[i + 1] = (Math.random() - 0.5) * 0.02;
  velocities[i + 2] = (Math.random() - 0.5) * 0.02;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Get current theme for particle color
const getParticleColor = () => {
  const theme = body.getAttribute('data-theme');
  return theme === 'dark' ? 0x7c8fff : 0x667eea;
};

const material = new THREE.PointsMaterial({
  size: 0.5,
  color: getParticleColor(),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Create connecting lines
const lineMaterial = new THREE.LineBasicMaterial({
  color: getParticleColor(),
  transparent: true,
  opacity: 0.2,
  blending: THREE.AdditiveBlending
});

const lineGeometry = new THREE.BufferGeometry();
const linePositions = [];
const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lines);

// Update particle colors when theme changes
themeToggle.addEventListener('click', () => {
  setTimeout(() => {
    const newColor = getParticleColor();
    material.color.setHex(newColor);
    lineMaterial.color.setHex(newColor);
  }, 50);
});

// Animation loop
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);
  
  const positions = particles.geometry.attributes.position.array;
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] += velocities[i];
    positions[i + 1] += velocities[i + 1];
    positions[i + 2] += velocities[i + 2];
    
    if (Math.abs(positions[i]) > 50) {
      positions[i] = -positions[i];
      velocities[i] = -velocities[i];
    }
    if (Math.abs(positions[i + 1]) > 50) {
      positions[i + 1] = -positions[i + 1];
      velocities[i + 1] = -velocities[i + 1];
    }
    if (Math.abs(positions[i + 2]) > 50) {
      positions[i + 2] = -positions[i + 2];
      velocities[i + 2] = -velocities[i + 2];
    }
  }
  
  particles.geometry.attributes.position.needsUpdate = true;
  
  // Create lines between nearby particles
  linePositions.length = 0;
  const maxDistance = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    for (let j = i + 1; j < particleCount; j++) {
      const j3 = j * 3;
      
      const dx = positions[i3] - positions[j3];
      const dy = positions[i3 + 1] - positions[j3 + 1];
      const dz = positions[i3 + 2] - positions[j3 + 2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (distance < maxDistance) {
        linePositions.push(
          positions[i3], positions[i3 + 1], positions[i3 + 2],
          positions[j3], positions[j3 + 1], positions[j3 + 2]
        );
      }
    }
  }
  
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  
  particles.rotation.x += 0.0005;
  particles.rotation.y += 0.0005;
  particles.rotation.x += mouseY * 0.0003;
  particles.rotation.y += mouseX * 0.0003;
  
  lines.rotation.copy(particles.rotation);
  
  renderer.render(scene, camera);
}

animate();

// ===== HANDLE WINDOW RESIZE =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===== SCROLL ANIMATIONS =====
const fadeObserverOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, fadeObserverOptions);

document.querySelectorAll('.project-item, .info-card, .contact-info-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});