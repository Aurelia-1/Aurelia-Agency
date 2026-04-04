// Cursor animation
    document.addEventListener('DOMContentLoaded', function () {
      const cursor = document.querySelector('.cursor');
      const cursorFollower = document.querySelector('.cursor-follower');

      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        setTimeout(() => {
          cursorFollower.style.left = e.clientX + 'px';
          cursorFollower.style.top = e.clientY + 'px';
        }, 100);
      });

      // Hover effects
      document.querySelectorAll('a, button, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.style.transform = 'scale(1.5)';
          cursorFollower.style.borderColor = 'rgba(200,16,46,0.8)';
          cursorFollower.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.transform = 'scale(1)';
          cursorFollower.style.borderColor = 'rgba(200,16,46,0.5)';
          cursorFollower.style.transform = 'scale(1)';
        });
      });

      // Reveal animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, observerOptions);

      document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
      });

      // ── NAVBAR SCROLL ──
      const navbar = document.getElementById('navbar');
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
      });

      // Initialize Lucide icons
      lucide.createIcons();
    });