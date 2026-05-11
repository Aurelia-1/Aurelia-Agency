// =====================================================
// PROJECTS PAGE CONTROLLER v2
// Bento + Featured Layout — Filtering & Reveal
// =====================================================

document.addEventListener('DOMContentLoaded', function () {

  // ── INTERSECTION OBSERVER FOR REVEAL ANIMATIONS ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger based on index within grid
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('active');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px 60px 0px'
  });

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.revealDelay = i * 80;
    observer.observe(el);
  });

  // ── INIT LUCIDE ICONS ──
  if (typeof lucide !== 'undefined') lucide.createIcons();
});