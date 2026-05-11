// =====================================================
// CINEMATIC INTRO ANIMATION (JS-powered)
// =====================================================
(function () {
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  document.body.style.overflow = 'hidden';

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  overlay.insertBefore(canvas, overlay.firstChild);
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const CX = () => canvas.width / 2;
  const CY = () => canvas.height / 2;

  function spawnParticle() {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.max(canvas.width, canvas.height) * 0.7 + 200;
    particles.push({
      x: CX() + Math.cos(angle) * radius,
      y: CY() + Math.sin(angle) * radius,
      tx: CX() + (Math.random() - 0.5) * 60,
      ty: CY() + (Math.random() - 0.5) * 60,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.018 + 0.008,
      progress: 0,
      opacity: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.5 ? 'red1' : 'red2',
      trail: []
    });
  }

  for (let i = 0; i < 90; i++) spawnParticle();

  let introDone = false;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInQuad(t) { return t * t; }

  function drawIntroParticles() {
    if (introDone) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.progress = Math.min(p.progress + p.speed, 1);
      const ease = easeInQuad(p.progress);
      const cx = lerp(p.x, p.tx, ease);
      const cy = lerp(p.y, p.ty, ease);

      p.trail.push({ x: cx, y: cy });
      if (p.trail.length > 10) p.trail.shift();

      for (let t = 0; t < p.trail.length - 1; t++) {
        const alpha = (t / p.trail.length) * p.opacity * (1 - p.progress * 0.5);
        ctx.beginPath();
        ctx.strokeStyle = p.color === 'red1'
          ? `rgba(195,1,1,${alpha})`
          : `rgba(255,68,68,${alpha})`;
        ctx.lineWidth = p.size * (t / p.trail.length);
        ctx.moveTo(p.trail[t].x, p.trail[t].y);
        ctx.lineTo(p.trail[t + 1].x, p.trail[t + 1].y);
        ctx.stroke();
      }

      const alpha = p.opacity * (1 - p.progress * 0.6);
      ctx.beginPath();
      ctx.arc(cx, cy, p.size * (1 - p.progress * 0.3), 0, Math.PI * 2);
      ctx.fillStyle = p.color === 'red1'
        ? `rgba(195,1,1,${alpha})`
        : `rgba(255,68,68,${alpha})`;
      ctx.fill();

      if (p.progress >= 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.max(canvas.width, canvas.height) * 0.6 + 150;
        p.x = CX() + Math.cos(angle) * radius;
        p.y = CY() + Math.sin(angle) * radius;
        p.tx = CX() + (Math.random() - 0.5) * 80;
        p.ty = CY() + (Math.random() - 0.5) * 80;
        p.progress = 0;
        p.trail = [];
        p.speed = Math.random() * 0.015 + 0.006;
      }
    });

    requestAnimationFrame(drawIntroParticles);
  }

  requestAnimationFrame(drawIntroParticles);

  overlay.addEventListener('animationend', function (e) {
    if (e.animationName === 'introOverlayFadeOut') {
      introDone = true;
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
})();

// =====================================================
// EXISTING CODE — KUCH CHANGE NAHI
// ====================================================

lucide.createIcons();

// ── FORCE LIGHT THEME ──
document.body.classList.add('theme-light');
document.documentElement.style.background = '#f4f4f2';
localStorage.setItem('aurelia-theme', 'light');

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// revealObserver has been moved to mobile-nav.js for global consistency

// ── COUNTER ANIMATION ──
function animateCounter(el, target, duration = 2000) {
  let startTime = null;
  function updateCounter(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.floor(easeProgress * target);
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(updateCounter);
}

const countersObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(counter => {
        animateCounter(counter, parseInt(counter.getAttribute('data-target')));
      });
      countersObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const statsEl = document.querySelector('.stats');
const heroNumber = document.querySelector('.hero-number');
if (statsEl) countersObserver.observe(statsEl);
if (heroNumber) countersObserver.observe(heroNumber);

// ── CONTACT FORM — With WhatsApp Integration ──
const form = document.querySelector('#contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit span');
    const firstName = form.querySelector('input[name="firstName"]').value;
    const lastName = form.querySelector('input[name="lastName"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const service = form.querySelector('select[name="service"]').value;
    const message = form.querySelector('textarea[name="message"]').value;
    
    btn.textContent = 'Sending...';
    
    // Format message for WhatsApp
    const whatsappMessage = `Hello! I'm interested in your services.%0A%0A*Contact Information:*%0AName: ${firstName} ${lastName}%0AEmail: ${email}%0AService: ${service}%0A%0A*Message:*%0A${message}`;
    const whatsappUrl = `https://wa.me/923193921895?text=${whatsappMessage}`;
    
    // Send email via EmailJS
    emailjs.sendForm('service_82oceyp', 'template_hhblcmu', form).then(
      () => {
        btn.textContent = 'Opening WhatsApp...';
        // Open WhatsApp after email is sent
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
          btn.textContent = 'Message Sent! ✓';
          form.reset();
          setTimeout(() => btn.textContent = 'Send Message →', 3000);
        }, 800);
      },
      (error) => {
        btn.textContent = 'Error! Opening WhatsApp...';
        // Open WhatsApp even if email fails
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
          form.reset();
          setTimeout(() => btn.textContent = 'Send Message →', 3000);
        }, 800);
        console.error(error);
      }
    );
  });
}

// ── VISITORS COUNTER ──
const visitorEl = document.getElementById('visitors');
if (visitorEl) {
  function updateVisitors() {
    visitorEl.classList.add('fade-out');
    setTimeout(() => {
      visitorEl.textContent = (Math.floor(Math.random() * 500) + 50) + ' Visitors';
      visitorEl.classList.remove('fade-out');
      visitorEl.classList.add('fade-in');
    }, 400);
  }
  setInterval(updateVisitors, 2500);
}

function toggleDesc(btn) {
  const desc = btn.previousElementSibling;
  const isHidden = desc.style.display === 'none';
  desc.style.display = isHidden ? 'block' : 'none';
  btn.textContent = isHidden ? 'See less ↑' : 'See more ↓';
}

// ── REVIEWS FORM ──
(function () {
  var rvRating = 0;
  var stars = document.querySelectorAll('.rv-star-pick');

  stars.forEach(function (s) {
    s.addEventListener('mouseenter', function () { highlightStars(+s.dataset.v); });
    s.addEventListener('mouseleave', function () { highlightStars(rvRating); });
    s.addEventListener('click', function () { rvRating = +s.dataset.v; highlightStars(rvRating); });
  });

  function highlightStars(v) {
    stars.forEach(function (s) {
      s.style.color = (+s.dataset.v <= v) ? 'var(--red)' : 'rgba(255,255,255,0.2)';
    });
  }

  window.toggleRvForm = function () {
    var form = document.getElementById('rvForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  };

  window.submitRvForm = function () {
    var name = document.getElementById('rvName').value.trim();
    var biz = document.getElementById('rvBusiness').value.trim();
    var pos = document.getElementById('rvPosition').value.trim();
    var text = document.getElementById('rvText').value.trim();
    if (!name || !text || !rvRating) return;

    document.getElementById('rvName').value = '';
    document.getElementById('rvBusiness').value = '';
    document.getElementById('rvPosition').value = '';
    document.getElementById('rvText').value = '';
    rvRating = 0;
    highlightStars(0);

    var suc = document.getElementById('rvSuccess');
    suc.style.display = 'block';
    setTimeout(function () {
      suc.style.display = 'none';
      document.getElementById('rvForm').style.display = 'none';
    }, 2500);
  };
})();