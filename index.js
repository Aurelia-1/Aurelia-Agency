// ═══════════════════════════════════════
//   FIRESTORE IMPORTS
// ═══════════════════════════════════════
import { submitReview, getApprovedReviews } from './firestore.js';

// Initialize Lucide Icons
    lucide.createIcons();

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

    // ── COUNTER ANIMATION (easeOutExpo) ──
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

    // ── INTERSECTION OBSERVER FOR COUNTERS ──
    const countersObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.counter').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            animateCounter(counter, target);
          });
          countersObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const statsEl = document.querySelector('.stats');
    const heroNumber = document.querySelector('.hero-number');
    if (statsEl) countersObserver.observe(statsEl);
    if (heroNumber) countersObserver.observe(heroNumber);

    // ── CONTACT FORM HANDLER ──
    const form = document.querySelector('#contactForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit span');

        // Show loading state
        btn.textContent = 'Sending...';

        // Submit to EmailJS
        emailjs.sendForm('service_82oceyp', 'template_hhblcmu', form).then(
          () => {
            btn.textContent = 'Message Sent! ✓';
            form.reset(); // Clear form
            setTimeout(() => btn.textContent = 'Send Message →', 3000);
          },
          (error) => {
            btn.textContent = 'Error! Please try again.';
            console.error('Form submission error:', error);
            setTimeout(() => btn.textContent = 'Send Message →', 3000);
          }
        );
      });
    }
  


let visitorEl = document.getElementById("visitors");

function getRandomVisitors() {
  return Math.floor(Math.random() * 500) + 50; 
  // range: 50 se 550 tak (adjust kar sakta hai)
}

function updateVisitors() {
  visitorEl.classList.add("fade-out");

  setTimeout(() => {
    let newValue = getRandomVisitors();
    visitorEl.textContent = newValue + " Visitors";

    visitorEl.classList.remove("fade-out");
    visitorEl.classList.add("fade-in");
  }, 400);
}

// har 2.5 sec change
setInterval(updateVisitors, 2500);

function toggleDesc(btn) {
  const desc = btn.previousElementSibling;
  const isHidden = desc.style.display === 'none';
  desc.style.display = isHidden ? 'block' : 'none';
  btn.textContent = isHidden ? 'See less ↑' : 'See more ↓';
}
// Reviews section ke liye toggle function
(function() {
  var cur = 0;
  var rvRating = 0;
  var CARD_W = 384;

  var track = document.getElementById('rvTrack');
  var wrap = document.getElementById('rvWrap');
  var dotsEl = document.getElementById('rvDots');

  function totalCards() { return track.children.length; }

  function visibleCount() {
    var w = wrap.offsetWidth;
    return Math.max(1, Math.floor((w + 24) / CARD_W));
  }

  function maxIdx() { return Math.max(0, totalCards() - visibleCount()); }

  function buildDots() {
    dotsEl.innerHTML = '';
    var total = maxIdx() + 1;
    for (var i = 0; i < total; i++) {
      var d = document.createElement('div');
      d.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + (i === cur ? 'var(--red)' : 'rgba(255,255,255,0.2)') + ';cursor:pointer;transition:all 0.2s;';
      if (i === cur) { d.style.width = '24px'; d.style.borderRadius = '4px'; }
      (function(idx){ d.addEventListener('click', function(){ goTo(idx); }); })(i);
      dotsEl.appendChild(d);
    }
  }

  function goTo(n) {
    cur = Math.max(0, Math.min(n, maxIdx()));
    track.style.transform = 'translateX(-' + (cur * CARD_W) + 'px)';
    buildDots();
  }

  document.getElementById('rvPrev').addEventListener('click', function(){ resetAuto(); goTo(cur - 1); });
  document.getElementById('rvNext').addEventListener('click', function(){ resetAuto(); goTo(cur + 1); });

  window.addEventListener('resize', function(){ buildDots(); goTo(Math.min(cur, maxIdx())); });

  buildDots();

  // Auto-play
  var autoTimer;
  function startAuto() {
    autoTimer = setInterval(function() {
      goTo(cur >= maxIdx() ? 0 : cur + 1);
    }, 3000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  startAuto();

  // Hover par pause
  wrap.addEventListener('mouseenter', function() { clearInterval(autoTimer); });
  wrap.addEventListener('mouseleave', function() { startAuto(); });

  // Stars
  var stars = document.querySelectorAll('.rv-star-pick');
  stars.forEach(function(s) {
    s.addEventListener('mouseenter', function(){ highlightStars(+s.dataset.v); });
    s.addEventListener('mouseleave', function(){ highlightStars(rvRating); });
    s.addEventListener('click', function(){ rvRating = +s.dataset.v; highlightStars(rvRating); });
  });

  function highlightStars(v) {
    stars.forEach(function(s) {
      s.style.color = (+s.dataset.v <= v) ? 'var(--red)' : 'rgba(255,255,255,0.2)';
    });
  }

  window.toggleRvForm = function() {
    var form = document.getElementById('rvForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  };

  window.submitRvForm = async function() {
    var name = document.getElementById('rvName').value.trim();
    var biz = document.getElementById('rvBusiness').value.trim();
    var pos = document.getElementById('rvPosition').value.trim();
    var text = document.getElementById('rvText').value.trim();
    if (!name || !text || !rvRating) { 
      alert('Sab fields fill karein aur rating select karein!');
      return; 
    }

    // Disable button & show loading
    const submitBtn = document.querySelector('#rvForm button[onclick="submitRvForm()"]');
    if (submitBtn) {
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
    }

    try {
      // Submit to Firestore
      const result = await submitReview({
        name: name,
        business: biz,
        position: pos,
        text: text,
        rating: rvRating
      });

      if (result.success) {
        // Clear form
        document.getElementById('rvName').value = '';
        document.getElementById('rvBusiness').value = '';
        document.getElementById('rvPosition').value = '';
        document.getElementById('rvText').value = '';
        rvRating = 0;
        highlightStars(0);

        // Show success message
        var suc = document.getElementById('rvSuccess');
        if (suc) {
          suc.textContent = '✓ Review submitted! Will appear after admin approval.';
          suc.style.display = 'block';
        }

        setTimeout(function() {
          if (suc) suc.style.display = 'none';
          var form = document.getElementById('rvForm');
          if (form) form.style.display = 'none';
        }, 3000);
      } else {
        alert('Error: ' + (result.error || 'Failed to submit review'));
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Error: ' + err.message);
    } finally {
      // Re-enable button
      if (submitBtn) {
        submitBtn.textContent = 'Submit Review';
        submitBtn.disabled = false;
      }
    }
  };

  // Load approved reviews from Firestore when page loads
  window.addEventListener('load', async function() {
    try {
      const approvedReviews = await getApprovedReviews();
      if (approvedReviews.length > 0) {
        track.innerHTML = ''; // Clear default reviews
        approvedReviews.forEach(rv => {
          const starsHtml = '<i data-lucide="star" style="width:14px;height:14px;fill:var(--red);stroke:var(--red);"></i>'.repeat(rv.rating || 0);
          const card = document.createElement('div');
          card.className = 'review-card';
          card.style.flex = '0 0 360px';
          card.innerHTML =
            '<div class="review-quote">"</div>' +
            '<div class="review-stars">' + starsHtml + '</div>' +
            '<p class="review-text">' + rv.text + '</p>' +
            '<div class="review-author">' +
              '<div class="review-avatar">' + (rv.name || '?')[0].toUpperCase() + '</div>' +
              '<div>' +
                '<div class="review-name">' + (rv.name || 'Anonymous') + '</div>' +
                '<div class="review-location">' + (rv.position || '') + (rv.business ? ', ' + rv.business : '') + '</div>' +
              '</div>' +
            '</div>';
          track.appendChild(card);
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
        buildDots();
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  });
})();