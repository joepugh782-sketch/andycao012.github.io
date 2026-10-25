import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'power4.out';
const MEDIA = {
  desktop: '(min-width: 901px)',
  compact: '(max-width: 900px)',
  reduce: '(prefers-reduced-motion: reduce)',
};

// Measure before applying transforms: the second project row has a visual order
// different from its DOM order, and the mobile layouts have more rows.
function visualRows(elements) {
  const measured = elements.map(element => ({ element, rect: element.getBoundingClientRect() }))
    .sort((a, b) => Math.round(a.rect.top - b.rect.top) || a.rect.left - b.rect.left);
  const rows = [];
  for (const item of measured) {
    const last = rows.at(-1);
    if (last && Math.abs(last.top - item.rect.top) < 8) last.items.push(item.element);
    else rows.push({ top: item.rect.top, items: [item.element] });
  }
  return rows.map(row => row.items);
}

function alreadyPassed(element, seen) {
  return seen.has(element) || element.getBoundingClientRect().bottom < 80;
}

function entrance(trigger, seen, defaults = {}) {
  return gsap.timeline({
    defaults: { ease: EASE, duration: 1.45, ...defaults },
    scrollTrigger: {
      trigger,
      start: 'top 88%',
      end: 'bottom top',
      once: true,
      fastScrollEnd: 2200,
      onLeave: self => self.animation?.progress(1),
    },
    onComplete: () => seen.add(trigger),
  });
}

function revealCards(elements, { desktop, seen, delay = 0 }) {
  visualRows(elements).forEach(row => {
    const items = row.filter(element => !alreadyPassed(element, seen));
    if (!items.length) return;
    const timeline = entrance(items[0], seen);
    items.forEach((card, index) => {
      const at = delay + index * .17;
      timeline.fromTo(card, {
        y: desktop ? 110 + (index % 2) * 30 : 62,
        x: desktop && items.length > 1 ? (index % 2 ? 30 : -30) : 0,
        scale: .96,
        autoAlpha: 0,
      }, {
        y: 0, x: 0, scale: 1, autoAlpha: 1,
        clearProps: 'transform,opacity,visibility',
        onComplete: () => seen.add(card),
      }, at);
      // Keep the portrait's original color and scale; only its frame is revealed.
      const portrait = card.querySelector('.portrait-frame');
      if (portrait) timeline.fromTo(portrait,
        { clipPath: 'inset(0% 0% 100% 0% round 18px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.65, clearProps: 'clipPath' }, at + .14);
    });
  });
}

export function usePortfolioMotion(scope) {
  const introPlayed = useRef(false);
  const initialAnchor = useRef(null);
  const anchorInterrupted = useRef(false);
  const seen = useRef(new WeakSet());

  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return undefined;
    // Native hashes may be resolved before React has mounted their targets.
    if (!initialAnchor.current) {
      let id;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = ''; }
      initialAnchor.current = { id, hash: location.hash };
    }
    const anchor = initialAnchor.current;
    const target = anchor.id && anchor.hash === location.hash && document.getElementById(anchor.id);
    const alignAnchor = () => {
      if (target && root.contains(target) && !anchorInterrupted.current && location.hash === anchor.hash) {
        const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'instant' });
      }
    };
    alignAnchor();
    const cancelAnchor = () => { anchorInterrupted.current = true; };
    const inputEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
    const clearAnchorListeners = () => inputEvents.forEach(event => window.removeEventListener(event, cancelAnchor));
    if (target) inputEvents.forEach(event => window.addEventListener(event, cancelAnchor, { passive: true, once: true }));
    const media = gsap.matchMedia();
    let disposed = false;

    media.add(MEDIA, context => {
      const { desktop, reduce } = context.conditions;
      // Everything is visible in the base CSS. Reverting this context also
      // clears inline styles when the user enables reduced motion at runtime.
      if (reduce) {
        introPlayed.current = true;
        root.querySelectorAll('.motion-heading, .border-glow-card, .section-top, .work-toolbar, .work-bottom, .contact-heading, .contact-action, .contact-details, .site-footer').forEach(element => {
          if (element.getBoundingClientRect().top < innerHeight) seen.current.add(element);
        });
        return undefined;
      }

      const query = selector => root.querySelector(selector);
      const all = selector => [...root.querySelectorAll(selector)];
      const finishable = [];
      const headerItems = [...document.querySelector('.site-header .nav-inner').children];
      const opening = !introPlayed.current && window.scrollY < 80 && (!location.hash || location.hash === '#home');

      if (opening) {
        const title = query('.hero-title-word');
        const copyLines = all('.hero-copy-line-inner');
        const manifesto = all('.manifesto-line-inner');
        const timeline = gsap.timeline({
          defaults: { ease: EASE },
          onComplete: () => { introPlayed.current = true; removeOpeningListeners(); },
        });
        finishable.push(timeline);
        timeline
          .fromTo(query('.hero-opening-shutter'), { scaleY: 1 }, { scaleY: 0, duration: 1.65, ease: 'power3.inOut' }, 0)
          .fromTo(title, { yPercent: 112, xPercent: -3, scaleY: .46, scaleX: 1.08 },
            { yPercent: 0, xPercent: 0, scaleY: 1, scaleX: 1, duration: 2.05, ease: 'expo.out', clearProps: 'transform' }, .3)
          .fromTo(headerItems, { y: -28, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.1, stagger: .07, clearProps: 'transform,opacity,visibility' }, .35)
          .fromTo(query('.hero-editorial-role'), { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, clearProps: 'transform,opacity,visibility' }, 1.05)
          .fromTo(copyLines, { yPercent: 115, scaleY: .8 },
            { yPercent: 0, scaleY: 1, duration: 1.3, stagger: .13, clearProps: 'transform' }, 1.14)
          .fromTo(all('.hero-editorial-description, .hero-editorial-stat, .hero-editorial-cta'), { y: 38, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.2, stagger: .14, clearProps: 'transform,opacity,visibility' }, 1.38)
          .fromTo(manifesto, { yPercent: 120, x: 36 },
            { yPercent: 0, x: 0, duration: 1.35, stagger: .12, clearProps: 'transform' }, 1.65)
          .fromTo(all('.hero-bottom > *'), { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, stagger: .07, clearProps: 'transform,opacity,visibility' }, 1.9);
      }

      all('.motion-heading').forEach(heading => {
        if (alreadyPassed(heading, seen.current)) return;
        const title = heading.querySelector('.motion-title');
        const supporting = [...heading.querySelectorAll('.profile-subtitle, .heading-description, .outline-number')];
        entrance(heading, seen.current)
          .fromTo(title, { yPercent: 125, x: desktop ? -70 : -24, scaleY: .62 },
            { yPercent: 0, x: 0, scaleY: 1, duration: 1.65, transformOrigin: '0% 100%', clearProps: 'transform' }, 0)
          .fromTo(supporting, { y: 26, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, stagger: .08, clearProps: 'transform,opacity,visibility' }, .48);
      });

      revealCards(all('.about-layout > .border-glow-card'), { desktop, seen: seen.current, delay: .18 });
      revealCards(all('.stats > .stat'), { desktop, seen: seen.current });
      revealCards(all('.expertise-heading'), { desktop, seen: seen.current, delay: .14 });
      revealCards(all('.ability-card'), { desktop, seen: seen.current, delay: .2 });

      const journey = query('.experience');
      if (!alreadyPassed(journey, seen.current)) {
        entrance(journey, seen.current)
          .fromTo(journey, { y: desktop ? 90 : 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, clearProps: 'transform,opacity,visibility' }, 0)
          .fromTo(journey.querySelectorAll('.job'), { x: desktop ? 58 : 24, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 1.15, stagger: .15, clearProps: 'transform,opacity,visibility' }, .28);
      }

      all('.section-top, .work-toolbar, .work-bottom, .contact-action, .contact-details, .site-footer').forEach(element => {
        if (alreadyPassed(element, seen.current)) return;
        entrance(element, seen.current, { duration: 1.15 })
          .fromTo(element, { y: desktop ? 40 : 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, clearProps: 'transform,opacity,visibility' });
      });

      const contact = query('.contact-heading');
      if (!alreadyPassed(contact, seen.current)) {
        entrance(contact, seen.current)
          .fromTo(contact.querySelectorAll('.contact-title-line'),
            { yPercent: 120, x: desktop ? -60 : -15, scaleY: .7 },
            { yPercent: 0, x: 0, scaleY: 1, transformOrigin: '0% 100%', duration: 1.7, stagger: .17, clearProps: 'transform' }, 0)
          .fromTo(query('.contact-pre'), { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, clearProps: 'transform,opacity,visibility' }, .3);
      }

      // Scroll or keyboard navigation can interrupt the opening immediately.
      // Completing it preserves visible, focusable controls without scroll locking.
      const finishIntro = () => {
        if (introPlayed.current) return;
        finishable.forEach(timeline => timeline.progress(1).pause());
        introPlayed.current = true;
        removeOpeningListeners();
      };
      const onScroll = () => { if (window.scrollY > 80) finishIntro(); };
      const onFocus = event => { if (event.target.matches('a, button')) finishIntro(); };
      const removeOpeningListeners = () => {
        window.removeEventListener('wheel', finishIntro);
        window.removeEventListener('touchstart', finishIntro);
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('focusin', onFocus);
      };
      if (opening) {
        window.addEventListener('wheel', finishIntro, { passive: true, once: true });
        window.addEventListener('touchstart', finishIntro, { passive: true, once: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('focusin', onFocus);
      }
      return removeOpeningListeners;
    }, root);

    // Local fonts can finish after the first paint; recalculate from final metrics.
    document.fonts.ready.then(() => {
      if (!disposed) { alignAnchor(); ScrollTrigger.refresh(); clearAnchorListeners(); }
    });
    return () => { disposed = true; clearAnchorListeners(); media.revert(); };
  }, [scope]);
}

export function useGalleryMotion(scope, category) {
  const seen = useRef(new WeakSet());
  const previousCategory = useRef(category);
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return undefined;
    if (previousCategory.current !== category) {
      seen.current = new WeakSet();
      previousCategory.current = category;
    }
    const media = gsap.matchMedia();
    media.add(MEDIA, context => {
      const { desktop, reduce } = context.conditions;
      if (reduce) {
        root.querySelectorAll('.project-card').forEach(card => {
          if (card.getBoundingClientRect().top < innerHeight) seen.current.add(card);
        });
        return undefined;
      }
      visualRows([...root.querySelectorAll('.project-card')]).forEach(row => {
        const pending = row.filter(card => !alreadyPassed(card, seen.current));
        if (!pending.length) return;
        const timeline = gsap.timeline({
          defaults: { ease: EASE },
          onComplete: () => pending.forEach(card => seen.current.add(card)),
          scrollTrigger: { trigger: pending[0], start: 'top 91%', end: 'bottom top', once: true, fastScrollEnd: 2200, onLeave: self => self.animation?.progress(1) },
        });
        pending.forEach((card, index) => {
          const at = index * .2;
          timeline
            .fromTo(card, { y: desktop ? 115 + index * 28 : 54, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 1.5, clearProps: 'transform,opacity,visibility' }, at)
            .fromTo(card.querySelector('.project-image-reveal'), { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.12 },
              { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.85, clearProps: 'transform,clipPath' }, at + .12)
            .fromTo(card.querySelector('.project-info'), { y: 32, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 1.1, clearProps: 'transform,opacity,visibility' }, at + .42);
        });
      });
      if (desktop) {
        root.querySelectorAll('.project-cover').forEach(cover => {
          // The depth layer owns scroll transforms; the img still owns hover.
          gsap.fromTo(cover.querySelector('.project-image-depth'),
            { yPercent: -2.2, scale: 1.055 },
            { yPercent: 2.2, scale: 1.055, ease: 'none', scrollTrigger: {
              trigger: cover, start: 'top bottom', end: 'bottom top', scrub: .65, invalidateOnRefresh: true,
            } });
        });
      }
    }, root);
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(frame); media.revert(); };
  }, [scope, category]);
}
