// =====================================================
// THEME TOGGLE — dark → light → blue → dark
// =====================================================
(function () {
  const THEMES = ['dark', 'light'];
  const KEY = 'aurelia-theme';

  function applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-blue');
    if (theme === 'light') document.body.classList.add('theme-light');
    if (theme === 'blue')  document.body.classList.add('theme-blue');
  }

  // Restore on load
  const saved = localStorage.getItem(KEY) || 'dark';
  applyTheme(saved);

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const current = localStorage.getItem(KEY) || 'dark';
        const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
        applyTheme(next);
        localStorage.setItem(KEY, next);
      });
    }
  });
})();

// =====================================================
// RED GLITTER CURSOR
// =====================================================
(function () {
  if (window.innerWidth <= 768) return;

  const glitterCanvas = document.createElement('canvas');
  glitterCanvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9997;';
  document.body.appendChild(glitterCanvas);
  const gc = glitterCanvas.getContext('2d');

  function resize() {
    glitterCanvas.width = window.innerWidth;
    glitterCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const glitters = [];
  let lastMx = -999, lastMy = -999;

  document.addEventListener('mousemove', (e) => {
    const mx = e.clientX, my = e.clientY;
    const dist = Math.hypot(mx - lastMx, my - lastMy);
    const count = Math.min(Math.floor(dist * 0.5) + 1, 7);
    for (let i = 0; i < count; i++) {
      spawnGlitter(mx + (Math.random() - 0.5) * 10, my + (Math.random() - 0.5) * 10);
    }
    lastMx = mx; lastMy = my;
  });

  function spawnGlitter(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3.5 + 0.8;
    const size = Math.random() * 4.5 + 1;
    const r = Math.random();
    glitters.push({
      x, y,
      vx: Math.cos(angle) * speed * 0.65,
      vy: Math.sin(angle) * speed * 0.65 - Math.random() * 2,
      size,
      life: 1,
      decay: Math.random() * 0.035 + 0.018,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.35,
      hue: r > 0.88 ? 'white' : r > 0.55 ? 'red1' : 'red2',
      type: r > 0.62 ? 'star' : r > 0.32 ? 'diamond' : 'spark',
      gravity: 0.07 + Math.random() * 0.06
    });
  }

  function drawStar(x, y, size, rot) {
    gc.save(); gc.translate(x, y); gc.rotate(rot); gc.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      gc.lineTo(Math.cos(a) * size, Math.sin(a) * size);
      const ma = a + Math.PI / 4;
      gc.lineTo(Math.cos(ma) * size * 0.3, Math.sin(ma) * size * 0.3);
    }
    gc.closePath(); gc.restore();
  }

  function drawDiamond(x, y, size, rot) {
    gc.save(); gc.translate(x, y); gc.rotate(rot); gc.beginPath();
    gc.moveTo(0, -size); gc.lineTo(size * 0.55, 0);
    gc.lineTo(0, size); gc.lineTo(-size * 0.55, 0);
    gc.closePath(); gc.restore();
  }

  function animateGlitter() {
    gc.clearRect(0, 0, glitterCanvas.width, glitterCanvas.height);
    for (let i = glitters.length - 1; i >= 0; i--) {
      const g = glitters[i];
      g.x += g.vx; g.y += g.vy;
      g.vy += g.gravity; g.vx *= 0.97;
      g.rotation += g.rotSpeed;
      g.life -= g.decay;
      if (g.life <= 0) { glitters.splice(i, 1); continue; }

      const a = g.life;
      gc.globalAlpha = a;
      const fill = g.hue === 'white' ? `rgba(255,255,255,${a})`
        : g.hue === 'red1' ? `rgba(195,1,1,${a})` : `rgba(255,50,50,${a})`;
      gc.shadowColor = g.hue === 'white' ? '#fff' : '#c30101';
      gc.shadowBlur = g.size * 4;
      gc.fillStyle = fill;

      if (g.type === 'star') { drawStar(g.x, g.y, g.size, g.rotation); gc.fill(); }
      else if (g.type === 'diamond') { drawDiamond(g.x, g.y, g.size, g.rotation); gc.fill(); }
      else {
        gc.save(); gc.translate(g.x, g.y); gc.rotate(g.rotation);
        gc.beginPath();
        gc.moveTo(-g.size * 2.2, 0); gc.lineTo(g.size * 2.2, 0);
        gc.lineWidth = g.size * 0.45;
        gc.strokeStyle = fill; gc.shadowBlur = g.size * 3; gc.stroke();
        gc.restore();
      }
      gc.shadowBlur = 0;
    }
    gc.globalAlpha = 1;
    requestAnimationFrame(animateGlitter);
  }
  animateGlitter();
})();

// =====================================================
// MAIN — navbar, reveal, filter, hamburger
// =====================================================
document.addEventListener('DOMContentLoaded', function () {

  // Lucide icons
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // ── NAVBAR SCROLL ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ── REVEAL OBSERVER WITH STAGGERED DELAYS ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Apply staggered reveal delays to project cards
  const projectCards = document.querySelectorAll('.project-card:not(.coming-soon)');
  projectCards.forEach((card, index) => {
    const delayClass = `reveal-delay-${Math.min(index + 1, 12)}`;
    card.classList.add(delayClass);
    observer.observe(card);
  });

  // Observe coming-soon card
  const comingSoon = document.querySelector('.project-card.coming-soon');
  if (comingSoon) {
    comingSoon.classList.add('reveal-delay-12');
    observer.observe(comingSoon);
  }

  // Observe other reveal elements
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('project-card')) {
      observer.observe(el);
    }
  });

  // ── FILTER ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterProjectCards = document.querySelectorAll('.project-card:not(.coming-soon)');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Filter cards
      filterProjectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          setTimeout(() => card.classList.add('active'), 10);
        } else {
          card.classList.remove('active');
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // ── HAMBURGER ──
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');

  if (hamburger && mobileNav) {
    function openNav() {
      hamburger.classList.add('open');
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
    hamburger.addEventListener('click', () =>
      mobileNav.classList.contains('open') ? closeNav() : openNav()
    );
    if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeNav);
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  }
});