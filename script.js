// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

function updateActiveLink() {
  const sections = ['home','services','why-us','about','process','testimonials','faq','contact'];
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

// ---- PARTICLES ----
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;
      width:${4 + Math.random() * 8}px;height:${4 + Math.random() * 8}px;
      background:${Math.random() > 0.5 ? 'rgba(13,27,75,0.12)' : 'rgba(232,100,10,0.15)'};
      left:${Math.random() * 100}%;top:${Math.random() * 100}%;
      animation:float ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite`;
    container.appendChild(p);
  }
})();

// ---- COUNTER ANIMATION ----
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.count;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString('en-IN');
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.classList.add('visible');
      // delay for child items
      el.querySelectorAll('[data-delay]').forEach(child => {
        child.style.transitionDelay = child.dataset.delay + 'ms';
      });
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .feature-card, .process-step, .about-content').forEach(el => {
  revealObserver.observe(el);
});

// ---- HERO COUNTER TRIGGER ----
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    heroObserver.disconnect();
  }
}, { threshold: 0.4 });
const heroSection = document.getElementById('home');
if (heroSection) heroObserver.observe(heroSection);

// ---- SERVICE CARDS STAGGERED ----
const serviceObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.service-card').forEach((card, i) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
    serviceObserver.disconnect();
  }
}, { threshold: 0.1 });

document.querySelectorAll('.service-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});
const servicesSection = document.getElementById('services');
if (servicesSection) serviceObserver.observe(servicesSection);

// ---- FAQ ACCORDION ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- TESTIMONIAL SLIDER ----
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (track) {
  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  const visible = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const maxIndex = total - visible;
  let current = 0;
  let autoTimer;

  // Create dots
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current < maxIndex ? current + 1 : 0), 4000);
  }

  prevBtn.addEventListener('click', () => goTo(current > 0 ? current - 1 : maxIndex));
  nextBtn.addEventListener('click', () => goTo(current < maxIndex ? current + 1 : 0));
  resetAuto();
}

// ---- CONTACT FORM ----
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      successMsg.style.display = 'block';
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
      setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
    }, 1200);
  });
}

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    }
  });
});

// THEME TOGGLE

const themeToggle =
document.getElementById('themeToggle');

const savedTheme =
localStorage.getItem('theme');

if(savedTheme === 'dark'){
document.body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {

document.body.classList.toggle('dark-mode');

if(document.body.classList.contains('dark-mode')){
localStorage.setItem('theme','dark');
}else{
localStorage.setItem('theme','light');
}

});