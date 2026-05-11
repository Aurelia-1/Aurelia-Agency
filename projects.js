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

  // ── FILTER LOGIC ──
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Collect filterable items: featured-wrap and bento-card
  const filterItems = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      filterItems.forEach(item => {
        const cat = item.dataset.category;
        const matches = filter === 'all' || cat === filter;

        if (matches) {
          item.style.display = '';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            if (item.style.opacity === '0') item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // ── INIT LUCIDE ICONS ──
  if (typeof lucide !== 'undefined') lucide.createIcons();
});