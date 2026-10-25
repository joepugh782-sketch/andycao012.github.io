import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowUp, Mail, Phone, Copy, Check, Menu, X, Focus, Layers3, Aperture, Sparkles } from 'lucide-react';
import { profile, experience, abilities, portfolioDocument } from './content';
import ProjectGallery from './ProjectGallery';
import Hero from './Hero';
import PageBackground from './PageBackground';
import BorderGlow from './BorderGlow';
import { usePortfolioMotion } from './motion';
import './about.css';
import './expertise.css';

function useActiveSection() {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const sections = [...document.querySelectorAll('main > section[id]')];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-25% 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return active;
}

function Navigation({ active }) {
  const [open, setOpen] = useState(false);
  const [floating, setFloating] = useState(false);
  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setFloating(hero.getBoundingClientRect().bottom <= 100);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  return <header className={`site-header${floating ? ' is-floating' : ''}`}><div className="nav-inner container">
    <a className="wordmark wordmark-design" href="#home" aria-label="曹佳豪作品集首页" onClick={() => setOpen(false)}>{profile.name}<span className="wordmark-caption">CAO JIAHAO<br/>DESIGN PORTFOLIO</span></a>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? '关闭导航' : '打开导航'}>{open ? <X /> : <Menu />}</button>
    <nav id="main-navigation" className={open ? 'navigation is-open' : 'navigation'} aria-label="主导航">{[['about','关于我'],['work','精选作品'],['expertise','个人优势']].map(([id,label]) => <a key={id} href={`#${id}`} className={active === id ? 'current' : ''} onClick={() => setOpen(false)}>{label}<span className="nav-dot" /></a>)}</nav>
    <a className="nav-contact" href="#contact" onClick={() => setOpen(false)}>聊聊合作 <ArrowUpRight size={16} /></a>
  </div></header>;
}


const PROFILE_GLOW = { unwrapped: true, edgeSensitivity: 30, glowColor: '14 87 60', backgroundColor: 'var(--profile-glass-surface)', borderRadius: 28, glowRadius: 18, glowIntensity: .75, coneSpread: 25, animated: false, colors: ['#ef4816', '#ff9567', '#728a9f'], fillOpacity: 0 };
function About() {
  return <section id="about" className="about about-profile section container" aria-labelledby="about-title">
    <div className="profile-heading motion-heading"><h2 id="about-title"><span className="motion-title-mask"><span className="motion-title">PROFILE</span></span></h2><span className="profile-subtitle">个人简介</span></div>
    <div className="about-layout"><BorderGlow {...PROFILE_GLOW} className="portrait-wrap"><div className="portrait-frame"><img src="/portrait-andy-cao-square.webp" alt="电商设计师曹佳豪的个人肖像" width="1254" height="1254" loading="lazy"/></div><div className="portrait-caption"><span>曹佳豪 / ANDY CAO</span><span>{profile.role}</span></div></BorderGlow>
      <BorderGlow {...PROFILE_GLOW} className="about-copy"><span className="profile-intro-label">HELLO, I'M ANDY.</span><h3 className="profile-statement">审美之外，<br/>更关心<span className="about-emphasis">为什么。</span></h3><p className="profile-intro">{profile.intro}</p><p className="profile-bio">{profile.bio}</p><div className="about-contact"><a href={`tel:${profile.phone}`}><Phone size={14}/>{profile.phone}</a><a href={`mailto:${profile.email}`}><Mail size={15}/>{profile.email}</a></div></BorderGlow>
    </div>
    <div className="stats">{profile.stats.map(stat => <BorderGlow {...PROFILE_GLOW} className="stat" key={stat.label}><div>{stat.value}<span>{stat.suffix}</span></div><span className="stat-label">{stat.label}</span><span className="stat-en">{stat.en}</span></BorderGlow>)}</div>
    <BorderGlow {...PROFILE_GLOW} className="experience"><div className="experience-label"><span className="eyebrow">THE JOURNEY</span><h3>每一程，皆有积淀。</h3></div><div className="experience-list">{experience.map((job,i) => <div className="job" key={job.company}><span className="job-id">0{i+1}</span><div><h4>{job.company}</h4><p>{job.role}</p></div><span className="job-period">{job.period}</span></div>)}</div></BorderGlow>
  </section>;
}

const icons = { brand: Focus, product: Layers3, campaign: Aperture, tools: Sparkles };
const EXPERTISE_GLOW = { ...PROFILE_GLOW, backgroundColor: 'var(--expertise-glass)' };
function Expertise() {
  return <section id="expertise" className="expertise expertise-profile section" aria-labelledby="expertise-title"><div className="container">
    <div className="profile-heading motion-heading"><h2 id="expertise-title"><span className="motion-title-mask"><span className="motion-title">EXPERTISE</span></span></h2><span className="profile-subtitle">个人优势</span></div>
    <BorderGlow {...EXPERTISE_GLOW} className="expertise-heading"><h3>好看，是起点。<br/><span className="muted">有用，才是设计。</span></h3><p>将品牌理解、产品思考与视觉表现连在一起，<br/>让每一份设计，都有清晰的来由。</p></BorderGlow>
    <div className="ability-grid">{abilities.map((item,i) => { const Icon=icons[item.icon]; return <BorderGlow {...EXPERTISE_GLOW} as="article" className="ability-card" key={item.id}><div className="ability-top"><Icon strokeWidth={1.1} size={40}/><span>{item.id}</span></div><span className="ability-en">{item.en}</span><h3>{item.title}</h3><p>{item.text}</p><div className="ability-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></BorderGlow>; })}</div>
  </div></section>;
}

function CopyButton({ value, label, onFeedback }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try { await navigator.clipboard.writeText(value); setCopied(true); onFeedback(`${label}已复制`); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 2200); }
    catch { onFeedback(`暂时无法自动复制，请手动复制：${value}`); }
  }
  return <button className="copy-button" onClick={copy} aria-label={`复制${label}`}>{copied ? <Check size={18}/> : <Copy size={17}/>}</button>;
}

function Contact() {
  const [feedback, setFeedback] = useState({ text: '', serial: 0 });
  const setFeedbackText = text => setFeedback(previous => ({ text, serial: previous.serial + 1 }));
  return <section id="contact" className="contact" aria-labelledby="contact-title"><div className="contact-glow" aria-hidden="true"/><div className="container contact-inner">
    <div className="section-top"><span className="eyebrow"><span className="tiny-dot"/> 04 / THE NEXT CHAPTER</span><span className="section-side">期待下一次，和你一起创造。</span></div>
    <div className="contact-heading"><span className="contact-pre">HAVE SOMETHING IN MIND?</span><h2 id="contact-title"><span className="contact-title-mask"><span className="contact-title-line">LET'S MAKE</span></span><span className="contact-title-mask"><span className="contact-title-line"><span className="contact-emphasis">SOMETHING</span> <span className="contact-arrow">↗</span></span></span><span className="contact-title-mask"><span className="contact-title-line">MATTER<span className="title-period">.</span></span></span></h2></div>
    <div className="contact-action"><p>一个新的想法，一次新的合作。<br/><span>从一句「你好」开始。</span></p></div>
    <div className="contact-details"><div><span className="contact-label">EMAIL / 邮箱</span><div className="contact-value"><a href={`mailto:${profile.email}`}>{profile.email}</a><CopyButton value={profile.email} label="邮箱" onFeedback={setFeedbackText}/></div></div><div><span className="contact-label">PHONE / 电话</span><div className="contact-value"><a href={`tel:${profile.phone}`}>{profile.phone}</a><CopyButton value={profile.phone} label="手机号" onFeedback={setFeedbackText}/></div></div><a className="pdf-link" href={portfolioDocument.href} target="_blank" rel="noreferrer">完整作品集 PDF<ArrowUpRight size={18}/></a></div>
    <p className="copy-feedback" role="status" aria-live="polite"><span key={feedback.serial}>{feedback.text || '\u00a0'}</span></p>
    <footer className="site-footer"><a className="wordmark" href="#home" aria-label="回到首页">{profile.name}</a><span>© 2026 CAO JIAHAO · DESIGNED WITH INTENTION.</span><a href="#home" className="back-top">回到顶部 <ArrowUp size={16}/></a></footer>
  </div></section>;
}

export default function App() {
  const active = useActiveSection();
  const page = useRef(null);
  usePortfolioMotion(page);
  return <><a href="#about" className="skip-link">跳到主要内容</a><Navigation active={active}/><main ref={page} className="portfolio-page grainient-page"><PageBackground/><Hero/><About/><ProjectGallery/><Expertise/><Contact/></main></>;
}
