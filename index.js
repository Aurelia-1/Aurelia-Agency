
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
    document.querySelectorAll('a, button, .service-card, .project-card, .review-card, .owner-card').forEach(el => {
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
