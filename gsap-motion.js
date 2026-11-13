/* VOLTURA GSAP motion controller — local GSAP 3.15.1 + ScrollTrigger.
   Native scrolling remains in control. No remote runtime or scroll hijacking. */
(() => {
  'use strict';
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) {
    document.documentElement.dataset.gsap = 'unavailable';
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.dataset.gsap = 'ready';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
  const roots = new WeakMap();
  const revealSelector = [
    '.page-intro', '.balance-hero', '.stat-card', '.chart-card', '.panel',
    '.ledger-card', '.budget-card', '.goal-card', '.settings-card',
    '.cashflow-panel', '.overview-grid > *', '.stats-grid > *'
  ].join(',');

  function animateView(view) {
    if (!view || view.dataset.gsapEntered === '1') return;
    view.dataset.gsapEntered = '1';
    if (reduce.matches) return;
    const ctx = gsap.context(() => {
      const intro = view.querySelector('.page-intro');
      const balance = view.querySelector('.balance-hero');
      const targets = [intro, balance].filter(Boolean);
      if (targets.length) gsap.fromTo(targets,
        { y: 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: .48, stagger: .07, ease: 'power2.out', clearProps: 'transform' }
      );
    }, view);
    roots.set(view, ctx);
  }

  function revealWithin(scope) {
    if (reduce.matches) return;
    const nodes = [];
    if (scope.matches?.(revealSelector)) nodes.push(scope);
    nodes.push(...(scope.querySelectorAll?.(revealSelector) || []));
    nodes.forEach(el => {
      if (el.dataset.gsapReveal === '1') return;
      el.dataset.gsapReveal = '1';
      gsap.fromTo(el,
        { y: 14, autoAlpha: .55 },
        { y: 0, autoAlpha: 1, duration: .5, ease: 'power2.out', clearProps: 'transform',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true, invalidateOnRefresh: true } }
      );
    });
  }

  function refresh() {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  // View navigation: app swaps .active on the view container without a page reload.
  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-view], .nav-item, .more-nav-item');
    if (!nav) return;
    requestAnimationFrame(() => {
      document.querySelectorAll('.view.active').forEach(view => {
        animateView(view);
        revealWithin(view);
      });
      refresh();
    });
  });

  // A quiet tactile response for primary actions; no magnetic cursor or layout movement.
  if (!coarse.matches && !reduce.matches) {
    document.addEventListener('pointerover', event => {
      const button = event.target.closest('button, [role="button"]');
      if (!button || button.disabled || button.dataset.gsapHover === '1') return;
      button.dataset.gsapHover = '1';
      gsap.to(button, { scale: 1.015, duration: .16, ease: 'power1.out', overwrite: true });
    });
    document.addEventListener('pointerout', event => {
      const button = event.target.closest('button, [role="button"]');
      if (!button || !button.dataset.gsapHover) return;
      gsap.to(button, { scale: 1, duration: .2, ease: 'power1.out', overwrite: true });
    });
    document.addEventListener('pointerdown', event => {
      const button = event.target.closest('button, [role="button"]');
      if (button && !button.disabled) gsap.to(button, { scale: .985, duration: .08, overwrite: true });
    });
    document.addEventListener('pointerup', event => {
      const button = event.target.closest('button, [role="button"]');
      if (button) gsap.to(button, { scale: 1, duration: .18, ease: 'back.out(2)', overwrite: true });
    });
  }

  // Initial screen + dynamically mounted screens and content.
  document.querySelectorAll('.view.active').forEach(animateView);
  revealWithin(document);
  const main = document.querySelector('#main-content') || document.body;
  const observer = new MutationObserver(records => {
    let changed = false;
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      revealWithin(node);
      if (node.matches?.('.view.active')) animateView(node);
      node.querySelectorAll?.('.view.active').forEach(animateView);
      changed = true;
    }));
    if (changed) refresh();
    document.querySelectorAll('.view.active').forEach(animateView);
  });
  observer.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

  // Existing horizontal editorial ticker: animate only if present; content remains readable.
  const ticker = document.querySelector('[data-gsap-ticker]');
  if (ticker && !reduce.matches) {
    const track = ticker.querySelector('[data-gsap-ticker-track]') || ticker.firstElementChild;
    if (track) {
      gsap.to(track, { xPercent: -12, ease: 'none',
        scrollTrigger: { trigger: ticker, start: 'top bottom', end: 'bottom top', scrub: .6 }
      });
    }
  }

  // Rebuild scroll-dependent positions when the responsive layout changes.
  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
    revealWithin(main);
    refresh();
    return () => ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars && trigger.vars.id === 'voltura-desktop-motion') trigger.kill();
    });
  });
  mm.add('(max-width: 760px)', () => {
    revealWithin(main);
    refresh();
  });
  reduce.addEventListener?.('change', () => {
    if (reduce.matches) {
      gsap.globalTimeline.pause();
      ScrollTrigger.disable(true);
    } else {
      ScrollTrigger.enable(true);
      gsap.globalTimeline.resume();
      refresh();
    }
  });
  window.addEventListener('load', refresh, { once: true });
  window.addEventListener('pageshow', refresh);
})();
