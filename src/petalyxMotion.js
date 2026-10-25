import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
let lenisScript;
function getLenis() {
  if (window.Lenis) return Promise.resolve(window.Lenis);
  if (!lenisScript) lenisScript = new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lenis@1.1.13/dist/lenis.min.js';
    script.onload = () => resolve(window.Lenis || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return lenisScript;
}

export function usePetalyxMotion(scope) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    let disposed = false;
    const mm = gsap.matchMedia();
    mm.add({ desktop:'(min-width: 901px)', reduce:'(prefers-reduced-motion: reduce)' }, context => {
      const { desktop, reduce } = context.conditions;
      const all = selector => [...root.querySelectorAll(selector)];
      const one = selector => root.querySelector(selector);
      const counters = all('[data-to]');
      const setCounters = p => counters.forEach(el => { el.textContent = Math.round(Number(el.dataset.to) * p); });
      if (reduce) { setCounters(1); return; }
      let lenis;
      let cleaned = false;
      const ticker = t => lenis?.raf(t * 1000);
      const scrollLink = e => {
        const a = e.target.closest('a[href^="#"]');
        if (!a || !lenis || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const id = a.getAttribute('href');
        const target = document.getElementById(id.slice(1));
        if (!target) return;
        e.preventDefault();
        history.pushState(null, '', id);
        lenis.scrollTo(target, { duration:1.5, offset:-85, onComplete:() => {
          // Transfer focus for keyboard and screen-reader anchor navigation.
          target.setAttribute('tabindex','-1'); target.focus({preventScroll:true});
        }});
      };
      getLenis().then(Lenis => {
        if (cleaned || disposed || !Lenis) return;
        lenis = new Lenis({ duration:1.25, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothWheel:true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(ticker);
      });
      root.addEventListener('click', scrollLink);
      const opening = scrollY < 40 && (!location.hash || location.hash === '#home');
      if (opening) {
        gsap.timeline({defaults:{ease:'power3.out'},onComplete:()=>ScrollTrigger.refresh()})
          .fromTo(root,{scale:.9,borderRadius:28},{scale:1,borderRadius:0,duration:1.4,ease:'expo.inOut',clearProps:'transform,borderRadius'},0)
          .from('.px-nav',{y:-16,autoAlpha:0,duration:.8,clearProps:'transform,opacity,visibility'},.9)
          .from('.px-hero .px-word',{y:24,autoAlpha:0,filter:'blur(10px)',stagger:.1,duration:1,clearProps:'transform,opacity,visibility,filter'},1)
          .from('.px-cloud-left',{x:-120,autoAlpha:0,duration:1.6,clearProps:'transform,opacity,visibility'},.4)
          .from('.px-cloud-right',{x:120,autoAlpha:0,duration:1.6,clearProps:'transform,opacity,visibility'},.4);
      }
      all('.px-reveal').forEach(el => gsap.from(el, { y:30,autoAlpha:0,duration:1,ease:'power3.out',clearProps:'transform,opacity,visibility',scrollTrigger:{trigger:el,start:'top 87%',once:true}}));
      gsap.to('.px-hero-copy',{yPercent:-32,ease:'none',scrollTrigger:{trigger:one('.px-hero'),start:'top top',end:'bottom top',scrub:1}});
      gsap.to('.px-cloud-left',{y:-120,ease:'none',scrollTrigger:{trigger:one('.px-hero'),start:'top top',end:'bottom top',scrub:1}});
      gsap.to('.px-cloud-right',{y:-180,ease:'none',scrollTrigger:{trigger:one('.px-hero'),start:'top top',end:'bottom top',scrub:1}});
      const proxy = { p:0 };
      if (desktop) {
        gsap.timeline({scrollTrigger:{trigger:one('.px-stats-stage'),start:'top top',end:'+=120%',pin:true,scrub:1,invalidateOnRefresh:true}})
          .to(proxy,{p:1,duration:1,ease:'none',onUpdate:()=>setCounters(proxy.p)},0)
          .fromTo('.px-tree',{yPercent:75},{yPercent:6,duration:1,ease:'none'},0);
      } else {
        gsap.to(proxy,{p:1,duration:2,ease:'power2.out',onUpdate:()=>setCounters(proxy.p),scrollTrigger:{trigger:one('.px-tickets'),start:'top 85%',once:true}});
        gsap.fromTo('.px-tree',{yPercent:35},{yPercent:0,ease:'none',scrollTrigger:{trigger:one('.px-stats-stage'),start:'top bottom',end:'bottom bottom',scrub:1}});
      }
      gsap.from('.px-ticket',{y:40,autoAlpha:0,stagger:.08,duration:.8,clearProps:'transform,opacity,visibility',scrollTrigger:{trigger:one('.px-tickets'),start:'top 90%',once:true}});
      gsap.fromTo('.px-night img',{yPercent:-12},{yPercent:0,ease:'none',scrollTrigger:{trigger:one('.px-contact'),start:'top bottom',end:'bottom bottom',scrub:1}});
      gsap.from('.px-contact-card',{y:80,scale:.94,autoAlpha:0,filter:'blur(10px)',duration:1.2,ease:'power3.out',clearProps:'transform,opacity,visibility,filter',scrollTrigger:{trigger:one('.px-contact'),start:'top 60%',once:true}});
      const dots = all('.px-fdot');
      gsap.timeline({scrollTrigger:{trigger:one('.px-footer'),start:'top 92%',once:true}})
        .set(dots,{opacity:1})
        .set('.px-fmark',{strokeDasharray:60,strokeDashoffset:60})
        .set('.px-ring',{strokeDasharray:233,strokeDashoffset:233})
        .to(dots,{y:-8,duration:.25,stagger:.08,yoyo:true,repeat:3,ease:'sine.inOut'})
        .to(dots,{attr:{cx:27,cy:50},duration:.45,ease:'power3.inOut'})
        .to(dots.slice(1),{opacity:0,duration:.1})
        .to('.px-fmark',{strokeDashoffset:0,duration:.6,ease:'power3.out'})
        .to(dots[0],{attr:{r:5.5},duration:.6,ease:'back.out(3)'},'<')
        .to('.px-ring',{strokeDashoffset:0,duration:.9,ease:'power2.inOut'},'-=.3');
      ScrollTrigger.refresh();
      return () => { cleaned=true; root.removeEventListener('click',scrollLink); gsap.ticker.remove(ticker); lenis?.destroy(); setCounters(1); };
    },root);
    const refresh = () => { if (!disposed) ScrollTrigger.refresh(); };
    const images = [...root.querySelectorAll('img')];
    images.forEach(img => img.addEventListener('load',refresh));
    document.fonts.ready.then(refresh);
    window.addEventListener('load',refresh);
    const anchorFrame = requestAnimationFrame(() => {
      if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'});
    });
    return () => { disposed=true; cancelAnimationFrame(anchorFrame); mm.revert(); images.forEach(img=>img.removeEventListener('load',refresh)); window.removeEventListener('load',refresh); };
  },[scope]);
}
