/**
 * AURELIA AGENCY — Shared Navigation Controller
 * Handles Hamburger Menu, Mobile Drawer, and Navbar Scroll Effects
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');

    if (!hamburger || !mobileNav) return;

    // ── NAVBAR SCROLL EFFECT ──
    const handleScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // ── MOBILE NAV TOGGLE ──
    const openMobileNav = () => {
        hamburger.classList.add('open');
        mobileNav.classList.add('open');
        mobileNav.setAttribute('aria-hidden', 'false');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        
        // Refresh icons if Lucide is present
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    const closeMobileNav = () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('open');
        if (isOpen) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });

    // Close on overlay click
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileNav);
    }

    // Close on link click (for anchors on the same page)
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileNav();
        });
    });

    // ── REVEAL OBSERVER (Global) ──
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // OPTIONAL: unobserve after reveal
                    // revealObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.05,
            rootMargin: '0px 0px -20px 0px' 
        });
        
        reveals.forEach(el => revealObserver.observe(el));
    }

    // ── INITIALIZE LUCIDE ──
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
