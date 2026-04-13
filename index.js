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
// RED GLITTER CURSOR
// =====================================================
(function () {
  // Mobile pe skip karo
  if (window.innerWidth <= 768) return;

  const glitterCanvas = document.createElement('canvas');
  glitterCanvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9997;';
  document.body.appendChild(glitterCanvas);
  const gc = glitterCanvas.getContext('2d');

  function resizeGlitter() {
    glitterCanvas.width = window.innerWidth;
    glitterCanvas.height = window.innerHeight;
  }
  resizeGlitter();
  window.addEventListener('resize', resizeGlitter);

  const glitters = [];
  let lastMx = -999, lastMy = -999;

  document.addEventListener('mousemove', (e) => {
    const mx = e.clientX;
    const my = e.clientY;
    const dist = Math.hypot(mx - lastMx, my - lastMy);
    const count = Math.min(Math.floor(dist * 0.5) + 1, 7);

    for (let i = 0; i < count; i++) {
      spawnGlitter(
        mx + (Math.random() - 0.5) * 10,
        my + (Math.random() - 0.5) * 10
      );
    }
    lastMx = mx;
    lastMy = my;
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
    gc.save();
    gc.translate(x, y);
    gc.rotate(rot);
    gc.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      gc.lineTo(Math.cos(a) * size, Math.sin(a) * size);
      const ma = a + Math.PI / 4;
      gc.lineTo(Math.cos(ma) * size * 0.3, Math.sin(ma) * size * 0.3);
    }
    gc.closePath();
    gc.restore();
  }

  function drawDiamond(x, y, size, rot) {
    gc.save();
    gc.translate(x, y);
    gc.rotate(rot);
    gc.beginPath();
    gc.moveTo(0, -size);
    gc.lineTo(size * 0.55, 0);
    gc.lineTo(0, size);
    gc.lineTo(-size * 0.55, 0);
    gc.closePath();
    gc.restore();
  }

  function animateGlitter() {
    gc.clearRect(0, 0, glitterCanvas.width, glitterCanvas.height);

    for (let i = glitters.length - 1; i >= 0; i--) {
      const g = glitters[i];
      g.x += g.vx;
      g.y += g.vy;
      g.vy += g.gravity;
      g.vx *= 0.97;
      g.rotation += g.rotSpeed;
      g.life -= g.decay;

      if (g.life <= 0) { glitters.splice(i, 1); continue; }

      const a = g.life;
      gc.globalAlpha = a;

      const fillColor = g.hue === 'white'
        ? `rgba(255,255,255,${a})`
        : g.hue === 'red1'
          ? `rgba(195,1,1,${a})`
          : `rgba(255,50,50,${a})`;

      gc.shadowColor = g.hue === 'white' ? '#ffffff' : '#c30101';
      gc.shadowBlur = g.size * 4;
      gc.fillStyle = fillColor;

      if (g.type === 'star') {
        drawStar(g.x, g.y, g.size, g.rotation);
        gc.fill();
      } else if (g.type === 'diamond') {
        drawDiamond(g.x, g.y, g.size, g.rotation);
        gc.fill();
      } else {
        gc.save();
        gc.translate(g.x, g.y);
        gc.rotate(g.rotation);
        gc.beginPath();
        gc.moveTo(-g.size * 2.2, 0);
        gc.lineTo(g.size * 2.2, 0);
        gc.lineWidth = g.size * 0.45;
        gc.strokeStyle = fillColor;
        gc.shadowBlur = g.size * 3;
        gc.stroke();
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
// EXISTING CODE — KUCH CHANGE NAHI
// =====================================================

lucide.createIcons();

// ── THEME TOGGLE ──
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  if (localStorage.getItem('aurelia-theme') === 'light') {
    document.body.classList.add('theme-light');
  }
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-light');
    localStorage.setItem('aurelia-theme',
      document.body.classList.contains('theme-light') ? 'light' : 'dark'
    );
  });
}

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followX = 0, followY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX - 5 + 'px';
  cursor.style.top = mouseY - 5 + 'px';
});
function animateFollower() {
  followX += (mouseX - followX) * 0.12;
  followY += (mouseY - followY) * 0.12;
  follower.style.left = followX - 18 + 'px';
  follower.style.top = followY - 18 + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();
document.querySelectorAll('a, button, .service-card, .project-card, .review-card, .owner-card, .team-member-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(2.5)';
    follower.style.transform = 'scale(1.5)';
    follower.style.borderColor = 'rgba(200,16,46,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    follower.style.transform = 'scale(1)';
    follower.style.borderColor = 'rgba(200,16,46,0.5)';
  });
});

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── REVEAL OBSERVER ──
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

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
}, { threshold: 0.3 });

const statsEl = document.querySelector('.stats');
const heroNumber = document.querySelector('.hero-number');
if (statsEl) countersObserver.observe(statsEl);
if (heroNumber) countersObserver.observe(heroNumber);

// ── CONTACT FORM ──
const form = document.querySelector('#contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit span');
    btn.textContent = 'Sending...';
    emailjs.sendForm('service_82oceyp', 'template_hhblcmu', form).then(
      () => {
        btn.textContent = 'Message Sent! ✓';
        form.reset();
        setTimeout(() => btn.textContent = 'Send Message →', 3000);
      },
      (error) => {
        btn.textContent = 'Error! Please try again.';
        console.error(error);
        setTimeout(() => btn.textContent = 'Send Message →', 3000);
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