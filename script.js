/* Letícia Souza — Landing Page Script v2 */

(function () {
  'use strict';

  /* ─── Element refs ──────────────────────────────── */
  var heroSection = document.querySelector('.hero');
  var heroPhoto   = document.getElementById('heroPhoto');
  var heroNav     = document.querySelector('.hero-nav');
  var ticking     = false;

  /* ─── Parallax + sticky nav ─────────────────────── */
  function onScroll() {
    var scrollY    = window.scrollY;
    var heroHeight = heroSection ? heroSection.offsetHeight : 0;

    /* Parallax: photo moves up at 28% scroll speed */
    if (heroPhoto && scrollY < heroHeight) {
      heroPhoto.style.transform = 'scale(1) translateY(' + (scrollY * 0.28) + 'px)';
    }

    /* Sticky nav: glass style once past 60px */
    if (heroNav) {
      if (scrollY > 60) {
        heroNav.classList.add('scrolled');
      } else {
        heroNav.classList.remove('scrolled');
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ─── Scroll reveal (Intersection Observer) ─────── */
  var revealEls = document.querySelectorAll('.rv-up, .rv-left, .rv-right');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    /* Fallback: show everything */
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ─── Smooth scroll for anchor links ────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = heroNav && heroNav.classList.contains('scrolled') ? 64 : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─── About badge counter animation ─────────────── */
  var counterEl = document.querySelector('.counter');

  if (counterEl && 'IntersectionObserver' in window) {
    var counterDone = false;

    var counterIO = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !counterDone) {
        counterDone = true;
        animateCounter(counterEl, 200, 1400);
        counterIO.disconnect();
      }
    }, { threshold: 0.5 });

    counterIO.observe(counterEl);
  }

  function animateCounter(el, target, duration) {
    var start     = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      var value    = Math.floor(eased * target);
      el.textContent = '+' + value;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = '+' + target;
    }

    requestAnimationFrame(step);
  }

})();
