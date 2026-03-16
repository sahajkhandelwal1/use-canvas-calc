/* ============================================================
   Canvas Plus Landing Page — main.js
   ============================================================ */

// ── Initialize Lucide icons
lucide.createIcons();

// ── Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ============================================================
   Mockup Interactivity
   ============================================================ */

// ── Course card drag-to-reorder (HTML5 DnD) ──
(function () {
  const grid = document.querySelector('.am-courses');
  if (!grid) return;

  let dragSrc = null;

  grid.addEventListener('dragstart', e => {
    const card = e.target.closest('.am-card');
    if (!card) return;
    dragSrc = card;
    // Slight delay so the ghost image renders before opacity drops
    requestAnimationFrame(() => card.classList.add('am-dragging'));
    e.dataTransfer.effectAllowed = 'move';
  });

  grid.addEventListener('dragend', e => {
    const card = e.target.closest('.am-card');
    if (card) card.classList.remove('am-dragging');
    grid.querySelectorAll('.am-card').forEach(c => c.classList.remove('am-drag-over'));
    dragSrc = null;
  });

  grid.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const card = e.target.closest('.am-card');
    if (card && card !== dragSrc) {
      grid.querySelectorAll('.am-card').forEach(c => c.classList.remove('am-drag-over'));
      card.classList.add('am-drag-over');
    }
  });

  grid.addEventListener('dragleave', e => {
    const card = e.target.closest('.am-card');
    if (card) card.classList.remove('am-drag-over');
  });

  grid.addEventListener('drop', e => {
    e.preventDefault();
    const target = e.target.closest('.am-card');
    if (!target || !dragSrc || target === dragSrc) return;

    // Determine drop position: before or after target
    const targetRect = target.getBoundingClientRect();
    const midX = targetRect.left + targetRect.width / 2;
    if (e.clientX < midX) {
      grid.insertBefore(dragSrc, target);
    } else {
      grid.insertBefore(dragSrc, target.nextSibling);
    }

    target.classList.remove('am-drag-over');

    // Animate the dropped card with GSAP
    gsap.fromTo(dragSrc, { scale: 0.95, opacity: 0.7 }, { scale: 1, opacity: 1, duration: 0.25, ease: 'back.out(1.5)' });
  });
})();

// ── Assignment check-off ──
(function () {
  document.querySelectorAll('.am-check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.am-upcoming-item');
      const isChecked = item.classList.toggle('am-checked');
      btn.setAttribute('aria-checked', isChecked);

      if (isChecked) {
        // Tick animation
        gsap.fromTo(btn, { scale: 1.4 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(item, { opacity: 0.5, duration: 0.3 });
      } else {
        gsap.to(item, { opacity: 1, duration: 0.2 });
      }
    });
  });
})();

/* ============================================================
   A. Nav scroll behavior
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================================================
   A2. Active nav link on scroll
   ============================================================ */
const navLinks = document.querySelectorAll('.nav-link');
const sections = ['stats', 'features', 'how-it-works', 'demo'].map(id => document.getElementById(id));

function updateActiveLink() {
  const scrollY = window.scrollY + 90;
  let current = null;
  sections.forEach(section => {
    if (section && section.offsetTop <= scrollY) current = section.id;
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

/* ============================================================
   B. Hero entrance animation
   ============================================================ */
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
  .from('#hero-badge', {
    opacity: 0, y: 18, duration: 0.65, delay: 0.15
  })
  .from('#hero-h1', {
    opacity: 0, y: 32, duration: 0.75
  }, '-=0.4')
  .from('#hero-sub', {
    opacity: 0, y: 22, duration: 0.65
  }, '-=0.5')
  .from('#hero-ctas', {
    opacity: 0, y: 18, duration: 0.55
  }, '-=0.5')
  .from('#scroll-indicator', {
    opacity: 0, duration: 0.5
  }, '-=0.3');

/* ============================================================
   C. Smooth scroll for anchor links
   ============================================================ */
document.querySelectorAll('.smooth-scroll').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 70 },
          duration: 1.05,
          ease: 'power3.inOut'
        });
      }
    }
  });
});

/* ============================================================
   D. Stats counter animation
   ============================================================ */
function animateCounter(el, target, suffix) {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 1.85,
    ease: 'power2.out',
    onUpdate() {
      el.textContent = Math.floor(obj.val) + suffix;
    },
    onComplete() {
      el.textContent = target + suffix;
    }
  });
}

// Set counters to 0 before they animate in
document.querySelectorAll('.stat-number').forEach(el => {
  const suffix = el.dataset.suffix || '';
  el.textContent = '0' + suffix;
});

ScrollTrigger.create({
  trigger: '#stats',
  start: 'top 78%',
  once: true,
  onEnter() {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix  = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
    });
  }
});

/* ============================================================
   E. Section headers — fade up
   ============================================================ */
gsap.utils.toArray('.section-header').forEach(header => {
  gsap.set(header, { opacity: 0, y: 24 });
  ScrollTrigger.create({
    trigger: header,
    start: 'top 85%',
    once: true,
    onEnter() {
      gsap.to(header, {
        opacity: 1, y: 0, duration: 0.65, ease: 'power2.out'
      });
    }
  });
});

/* ============================================================
   F. Feature cards — staggered batch entrance
   ============================================================ */
gsap.set('.feature-card', { opacity: 0, y: 38 });

ScrollTrigger.batch('.feature-card', {
  start: 'top 88%',
  once: true,
  onEnter(batch) {
    gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.075
    });
  }
});

/* ============================================================
   G. Steps — staggered entrance
   ============================================================ */
gsap.set('.step-card', { opacity: 0, y: 32 });

ScrollTrigger.create({
  trigger: '#how-it-works',
  start: 'top 75%',
  once: true,
  onEnter() {
    gsap.to('.step-card', {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: 'power2.out',
      stagger: 0.16
    });
  }
});

/* ============================================================
   H. Browser mockup — scale + fade entrance
   ============================================================ */
gsap.set('#browser-mockup', { opacity: 0, y: 50, scale: 0.975 });

ScrollTrigger.create({
  trigger: '#demo',
  start: 'top 78%',
  once: true,
  onEnter() {
    gsap.to('#browser-mockup', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.85,
      ease: 'power2.out'
    });

    // Callout pills stagger in after mockup lands
    gsap.set('.callout', { opacity: 0, x: 16 });
    gsap.to('.callout', {
      opacity: 1,
      x: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.14,
      delay: 0.5
    });
  }
});

/* ============================================================
   I. Final CTA section — staggered entrance
   ============================================================ */
gsap.set('#cta h2, #cta p, #cta .btn-xl', { opacity: 0, y: 28 });

ScrollTrigger.create({
  trigger: '#cta',
  start: 'top 80%',
  once: true,
  onEnter() {
    gsap.to('#cta h2, #cta p, #cta .btn-xl', {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: 'power2.out',
      stagger: 0.13
    });
  }
});
