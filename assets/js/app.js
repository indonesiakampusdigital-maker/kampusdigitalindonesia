/* ==========================================================================
   KDI — Kampus Digital Indonesia · Interaksi & Animasi
   1 Data  2 Render  3 Reveal  4 Header  5 Nav mobile  6 Progress+Top
   7 Pointer FX  8 Typing efek  9 Tilt kartu  10 Scroll-driven animasi
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------- 1. DATA ---------- */
  var TOPIK = ['Jago Shopee', 'TikTok Ads Master', 'Kelas Suhu Lazada', 'Mahir Google Ads', 'Mastah Meta Ads', 'Social Media Specialist', 'Marketing AI Class', 'Affiliate Marketing', 'Kelas Vibe Coding', 'Meta Ads Blueprint', 'Kelas AI Bisnis &amp; Productivity'];
  var MITRA = ['Riset Pasar', 'Audit Kanal', 'Strategi Iklan', 'Pendampingan UMKM', 'Pelatihan Korporat'];

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------- 2. RENDER ---------- */
  function renderDynamic() {
    var topTrack = document.getElementById('topbar-track');
    if (topTrack && topTrack.firstElementChild) {
      topTrack.appendChild(topTrack.firstElementChild.cloneNode(true));
      topTrack.style.animation = 'marqueeR 26s linear infinite';
    }
    var logoTrack = document.getElementById('logo-track');
    if (logoTrack) {
      var strip = TOPIK.map(function (t) { return '<span class="marquee__item">' + t + '</span>'; }).join('');
      logoTrack.innerHTML = strip + strip;
    }
    var bizLogos = document.getElementById('biz-logos');
    if (bizLogos) bizLogos.innerHTML = MITRA.map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('');
  }

  /* ---------- 3. SCROLL REVEAL ---------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]:not([data-reveal="none"])');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) {
      var sibs = el.parentElement ? el.parentElement.querySelectorAll(':scope > [data-reveal]') : [el];
      var i = Array.prototype.indexOf.call(sibs, el);
      el.style.transitionDelay = (Math.min(i, 7) * 90) + 'ms';
      io.observe(el);
    });
  }

  /* ---------- 4. HEADER STATE ---------- */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;
    function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 5. NAV MOBILE ---------- */
  function initNav() {
    var burger = document.getElementById('burger');
    if (!burger) return;
    function close() {
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Buka menu');
    }
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });
    document.querySelectorAll('.has-mega > button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var li = btn.parentElement;
        var open = li.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.addEventListener('click', function (e) {
      if (document.body.classList.contains('nav-open') && !e.target.closest('.header')) close();
    });
    document.querySelectorAll('.nav a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function () { if (window.innerWidth <= 900) close(); });
    });
  }

  /* ---------- 6. PROGRESS BAR & BACK TO TOP ---------- */
  function initScrollUi() {
    var bar = document.getElementById('progress-bar');
    var toTop = document.getElementById('totop');
    var ring = toTop ? toTop.querySelector('.ring .fg') : null;
    var CIRC = 151;
    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
      if (ring) ring.style.strokeDashoffset = (CIRC * (1 - p)).toFixed(1);
      if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 620);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
    if (toTop) toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 7. POINTER FX (spotlight/glow/magnetic) ---------- */
  function initPointerFx() {
    if (isTouch || reduceMotion) return;
    var hero = document.querySelector('.hero');
    var spot = document.querySelector('.hero__spot');
    if (hero && spot) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        spot.style.setProperty('--sx', (e.clientX - r.left) + 'px');
        spot.style.setProperty('--sy', (e.clientY - r.top) + 'px');
      });
    }
    document.querySelectorAll('.prog__card,.fcard,.misi li,.qcard').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.18;
        var dy = (e.clientY - r.top - r.height / 2) * 0.28;
        el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + (dy - 3).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- 8. TYPING EFFECT ---------- */
  var WORDS = ['Digital Marketing', 'Era Digital', 'Ekonomi Digital', 'Masa Depan Digital'];
  function initTyping() {
    var el = document.getElementById('typed');
    if (!el || reduceMotion) return;
    var wi = 0, ci = WORDS[0].length, deleting = false;
    function tick() {
      var word = WORDS[wi];
      if (deleting) {
        ci--;
        if (ci <= 0) { deleting = false; wi = (wi + 1) % WORDS.length; }
      } else {
        ci++;
        if (ci >= WORDS[wi].length) { deleting = true; setTimeout(tick, 2200); el.textContent = WORDS[wi].slice(0, ci); return; }
      }
      el.textContent = WORDS[wi].slice(0, ci);
      setTimeout(tick, deleting ? 45 : 95);
    }
    setTimeout(tick, 2400);
  }

  /* ---------- 9. TILT 3D KARTU HERO ---------- */
  function initTilt() {
    if (isTouch || reduceMotion) return;
    var tilt = document.querySelector('[data-tilt]');
    if (!tilt) return;
    var frame = null;
    tilt.addEventListener('pointermove', function (e) {
      if (frame) return;
      frame = requestAnimationFrame(function () {
        var r = tilt.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = 'perspective(1100px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' + (px * 6).toFixed(2) + 'deg) translateY(-4px)';
        frame = null;
      });
    });
    tilt.addEventListener('pointerleave', function () { tilt.style.transform = ''; });
  }

  /* ---------- 10. SCROLL-DRIVEN (parallax blob & spot stat) ---------- */
  function initScrollFx() {
    if (reduceMotion) return;
    var blobs = document.querySelectorAll('.blob');
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        blobs.forEach(function (b, i) {
          var speed = 0.06 + i * 0.03;
          b.style.marginTop = (y * speed).toFixed(1) + 'px';
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- 10b. RIPPLE TOMBOL ---------- */
  function initRipple() {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('pointerdown', function (e) {
        var r = btn.getBoundingClientRect();
        var d = Math.max(r.width, r.height);
        var s = document.createElement('span');
        s.className = 'ripple';
        s.style.width = s.style.height = d + 'px';
        s.style.left = (e.clientX - r.left - d / 2) + 'px';
        s.style.top = (e.clientY - r.top - d / 2) + 'px';
        btn.appendChild(s);
        setTimeout(function () { s.remove(); }, 650);
      });
    });
  }

  /* ---------- BOOT ---------- */
  renderDynamic();
  initReveal();
  initHeader();
  initNav();
  initScrollUi();
  initPointerFx();
  initTyping();
  initTilt();
  initScrollFx();
  initRipple();

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
