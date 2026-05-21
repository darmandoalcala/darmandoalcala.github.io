/* ============================================
   MAIN.JS — Landing Page Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initMobileMenu();
  initSmoothScroll();
  initParallaxOrbs();
  initContributionGraph();
});

/* ============================================
   NAVBAR — Transparent → Glass on Scroll
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check on load
}

/* ============================================
   TYPING EFFECT — Hero Subtitle
   ============================================ */
function initTypingEffect() {
  const element = document.getElementById('typed-text');
  if (!element) return;

  const texts = [
    'Desarrollador Full-Stack',
    'Soporte Técnico',
    'Ingeniero Informático',
    'Apasionado por la Tecnología'
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      element.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      delay = 50;
    } else {
      element.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      delay = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      delay = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = 500; // Pause before new word
    }

    setTimeout(type, delay);
  }

  // Start after a brief delay for the hero animations to play
  setTimeout(type, 1200);
}

/* ============================================
   SCROLL REVEAL — Intersection Observer
   ============================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const hamburger = document.querySelector('.navbar__hamburger');
  const navLinks = document.querySelector('.navbar__links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open')
      ? 'hidden'
      : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   SMOOTH SCROLL — Navigation Links
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const section = document.querySelector(targetId);
      if (!section) return;

      // For hero, scroll to very top
      if (targetId === '#hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Find the first real content element inside the section
      // (skips the large section padding-top)
      const content = section.querySelector(
        '.section-label, .section-title, .about__intro, .projects__header, .location__content, .footer__cta'
      ) || section;

      const navbarHeight = 70; // scrolled navbar approx height
      const gap = 20;
      const top = content.getBoundingClientRect().top + window.scrollY - navbarHeight - gap;

      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });
}

/* ============================================
   PARALLAX ORBS — Subtle Mouse Movement
   ============================================ */
function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.orb');
  if (orbs.length === 0) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    // Smooth interpolation
    currentX += (mouseX - currentX) * 0.03;
    currentY += (mouseY - currentY) * 0.03;

    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 15;
      const x = currentX * speed;
      const y = currentY * speed;
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================
   CONTRIBUTION GRAPH — GitHub-style Grid
   ============================================ */
function initContributionGraph() {
  const graph = document.getElementById('gh-contribution-graph');
  if (!graph) return;

  // Generate 52 weeks × 7 days = 364 cells
  const totalWeeks = 52;
  const totalCells = totalWeeks * 7;

  // Weighted random: mostly empty, some low, fewer high
  // This creates a realistic-looking contribution pattern
  const weights = [
    { level: 0, chance: 0.55 },
    { level: 1, chance: 0.20 },
    { level: 2, chance: 0.12 },
    { level: 3, chance: 0.08 },
    { level: 4, chance: 0.05 },
  ];

  function getRandomLevel() {
    const rand = Math.random();
    let cumulative = 0;
    for (const w of weights) {
      cumulative += w.chance;
      if (rand < cumulative) return w.level;
    }
    return 0;
  }

  // Create a burst pattern: some weeks are more active
  const burstWeeks = new Set();
  for (let i = 0; i < 8; i++) {
    burstWeeks.add(Math.floor(Math.random() * totalWeeks));
  }

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < totalCells; i++) {
    const week = Math.floor(i / 7);
    const cell = document.createElement('span');
    cell.classList.add('gh-cell');

    let level = getRandomLevel();

    // Boost activity during burst weeks
    if (burstWeeks.has(week) && Math.random() > 0.3) {
      level = Math.min(4, level + 1 + Math.floor(Math.random() * 2));
    }

    if (level > 0) {
      cell.setAttribute('data-level', level);
    }

    fragment.appendChild(cell);
  }

  graph.appendChild(fragment);
}
