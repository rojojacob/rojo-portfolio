/* assets/analytics.js
 * Lightweight event tracker for rojo-portfolio.
 * Sends events to Google Analytics 4 via window.gtag if present.
 * No-ops silently when gtag is missing or the Measurement ID is still
 * the placeholder, so local development stays quiet.
 *
 * Events emitted (name — params):
 *   resume_download — { file_name, link_text }
 *   outbound_click  — { link_url, link_domain, link_text }
 *   scroll_depth    — { percent } (25, 50, 75, 100; each fires once)
 *   section_view    — { section_id } (each section fires once on first view)
 */
(function () {
  'use strict';

  function track(name, params) {
    if (typeof window.gtag !== 'function') return;
    try { window.gtag('event', name, params || {}); }
    catch (e) { /* swallow — analytics must never break the page */ }
  }

  // ---------- Resume downloads ----------
  // Any <a> whose href ends in the resume filename, or has download attr
  // pointing at it, counts as a resume download.
  function wireResume() {
    var selectors = [
      'a[href$="RojoJacob-Resume.pdf"]',
      'a[download$="RojoJacob-Resume.pdf"]'
    ];
    var links = document.querySelectorAll(selectors.join(','));
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        track('resume_download', {
          file_name: 'RojoJacob-Resume.pdf',
          link_text: (a.textContent || '').trim().slice(0, 80)
        });
      }, { passive: true });
    });
  }

  // ---------- Outbound / mailto clicks ----------
  function wireOutbound() {
    var here = location.hostname;
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!href) return;
      // Skip resume — it has its own event.
      if (/RojoJacob-Resume\.pdf$/.test(href)) return;

      var isMail = href.indexOf('mailto:') === 0;
      var isTel  = href.indexOf('tel:') === 0;
      var isHash = href.charAt(0) === '#';
      if (isHash) return;

      var isExternal = isMail || isTel || /^https?:\/\//i.test(href);
      if (!isExternal) return;

      var domain = '';
      try {
        if (!isMail && !isTel) domain = new URL(href, location.href).hostname;
        if (domain === here) return; // same-site http link — not outbound
      } catch (e) { /* ignore URL parse errors */ }

      track('outbound_click', {
        link_url: href,
        link_domain: isMail ? 'mailto' : (isTel ? 'tel' : domain),
        link_text: (a.textContent || '').trim().slice(0, 80)
      });
    }, { capture: true, passive: true });
  }

  // ---------- Scroll depth (25/50/75/100) ----------
  function wireScrollDepth() {
    var thresholds = [25, 50, 75, 100];
    var fired = {};
    var ticking = false;

    function check() {
      ticking = false;
      var doc = document.documentElement;
      var scrolled = (window.scrollY || window.pageYOffset || 0) + window.innerHeight;
      var height = Math.max(doc.scrollHeight, doc.offsetHeight, document.body.scrollHeight);
      if (height <= 0) return;
      var pct = Math.min(100, Math.round((scrolled / height) * 100));
      thresholds.forEach(function (t) {
        if (!fired[t] && pct >= t) {
          fired[t] = true;
          track('scroll_depth', { percent: t });
        }
      });
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(check);
    }, { passive: true });

    // In case the page is already scrolled or short enough to count immediately.
    check();
  }

  // ---------- Section visibility ----------
  function wireSectionViews() {
    if (!('IntersectionObserver' in window)) return;
    var seen = {};
    var ids = ['hero','about','skills','work','process','testimonials','experience','awards','contact'];
    var targets = ids
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!targets.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        if (seen[id]) return;
        seen[id] = true;
        track('section_view', { section_id: id });
        io.unobserve(entry.target);
      });
    }, {
      // Count a section as "viewed" once ~40% is on screen.
      threshold: 0.4
    });
    targets.forEach(function (t) { io.observe(t); });
  }

  function init() {
    wireResume();
    wireOutbound();
    wireScrollDepth();
    wireSectionViews();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
