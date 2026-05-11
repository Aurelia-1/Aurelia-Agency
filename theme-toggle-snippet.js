// =====================================================
// THEME TOGGLE — dark → light → blue → dark
// =====================================================
(function () {
  const THEMES = ['dark', 'light' ];
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
// MAIN — cursor, reveal, navbar, lucide
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

  // ── REVEAL OBSERVER ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── HAMBURGER ──
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');

  if (hamburger && mobileNav) {
    function openNav() {
      hamburger.classList.add('open');
      mobileNav.classList.add('open');
      if (mobileNavOverlay) mobileNavOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    hamburger.addEventListener('click', () =>
      mobileNav.classList.contains('open') ? closeNav() : openNav()
    );
    if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeNav);
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  }
});
