import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, ArrowUp, Mail, Phone, Copy, Check, Menu, X, Play, Pause } from 'lucide-react';
import { profile, experience, projects, abilities, portfolioDocument } from './content';
import ProjectGallery from './ProjectGallery';
import { usePetalyxMotion } from './petalyxMotion';
import './petalyx.css';

export const scenery = {
  video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093331_5998f443-1b9c-4b62-820c-8219c73c72c4.mp4',
  poster: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093215_b7826239-e451-4e15-b42b-d6bcf9497a32.png',
  cloudA: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093216_44218665-b15e-4566-a2d4-2676ab03609d.png',
  cloudB: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093215_0f37c0c3-f82c-485b-87dd-5a35b75a8782.png',
  tree: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093215_95f11900-c4a0-49ad-bb2d-bb927dd594ee.png',
  night: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261021_093217_cc690198-ad8c-4127-8734-8485bd878351.png',
};
const navItems = [['关于我', '#about'], ['精选作品', '#work'], ['个人优势', '#expertise']];
function Mark({ className = '' }) {
  return <svg className={className} viewBox="0 0 30 22" fill="none" aria-hidden="true"><circle cx="4" cy="17" r="3.6" fill="currentColor"/><path d="M10.5 18.5 16.8 5.2 25.5 18.5" stroke="currentColor" strokeWidth="5.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function Label({ children }) { return <span className="px-pill">{children}</span>; }
function GridField() {
  return <div className="px-grid-field" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <span key={i} style={{left:`${((i * 13) % 30) * 3.5}%`, top:`${((i * 7) % 6) * 48}px`, animationDelay:`-${i * .37}s`}} />)}</div>;
}
function Navigation() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const escape = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, []);
  return <header className="px-header"><nav className="px-nav" aria-label="主导航">
    <a className="px-brand" href="#home" onClick={() => setOpen(false)}><Mark/><span>曹佳豪<small>ANDY CAO</small></span></a>
    <div id="px-menu" className={`px-nav-links ${open ? 'is-open' : ''}`}>{navItems.map(([label, href]) => <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>)}</div>
    <a href="#contact" className="px-btn px-nav-cta" onClick={() => setOpen(false)}>聊聊合作 <ArrowUpRight size={15}/></a>
    <button className="px-menu-toggle" aria-expanded={open} aria-controls="px-menu" aria-label={open ? '关闭菜单' : '打开菜单'} onClick={() => setOpen(!open)}>{open ? <X size={20}/> : <Menu size={20}/>}</button>
  </nav></header>;
}
function Hero() {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [reduce, setReduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReduce(query.matches); if (query.matches) video.current?.pause(); else video.current?.play().catch(() => {}); };
    query.addEventListener('change', update); update();
    return () => query.removeEventListener('change', update);
  }, []);
  const squares = [[3,64],[3,74],[8,74],[3,84],[45.5,79],[49,84],[49,79],[52.5,79],[86,58],[86,67],[82,76],[89.5,76],[86,84]];
  return <section id="home" className="px-hero" aria-labelledby="px-title">
    <div className="px-cloud px-cloud-left" aria-hidden="true"><img src={scenery.cloudA} className="px-drift-a" alt=""/></div>
    <div className="px-cloud px-cloud-right" aria-hidden="true"><img src={scenery.cloudB} className="px-drift-b" alt=""/></div>
    <div className="px-hero-copy"><Label>ANDY CAO · 电商视觉设计师</Label><h1 id="px-title"><span className="px-word">让好产品，</span><br/><span className="px-word px-olive">被看见。</span></h1><p className="px-word">以有温度的视觉，连接品牌与每一次心动。</p><a className="px-btn px-word" href="#work">探索我的作品 <ArrowUpRight size={16}/></a></div>
    <div className="px-hero-media"><video ref={video} autoPlay={!reduce} muted loop playsInline preload="metadata" poster={scenery.poster} src={scenery.video} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="樱花山谷动态背景" /></div>
    <div className="px-hero-glass" aria-hidden="true">{squares.map(([x,y],i) => <span className="px-glass" key={i} style={{left:`${x}%`,top:`${y}%`,width:x>40&&x<60?'clamp(28px,3.4vw,44px)':'clamp(36px,5.4vw,74px)',animationDelay:`-${i*.43}s`}}/>)}</div>
    <div className="px-hero-bottom"><a href="#about">向下探索 <ArrowDown size={15}/></a><span>GOOD DESIGN. REAL IMPACT.</span><button className="px-video-control" onClick={() => { if (playing) video.current.pause(); else video.current.play().catch(() => {}); }} aria-label={playing ? '暂停背景视频' : '播放背景视频'}>{playing ? <Pause size={14}/> : <Play size={14}/>}<span>{playing ? 'PAUSE' : 'PLAY'}</span></button></div>
  </section>;
}
function About() {
  return <section id="about" className="px-about" aria-labelledby="px-about-title">
    <div className="px-stats-stage"><GridField/><div className="px-tree-wrap"><img className="px-tree" src={scenery.tree} alt="" loading="lazy"/></div>
      <div className="px-stats-inner"><Label>01 / A LITTLE ABOUT ME</Label><h2 id="px-about-title" className="px-h2 px-reveal">审美之外，<br/><span>更关心为什么。</span></h2><p className="px-stats-note">从品牌到产品，让每一次表达都有来由。</p>
        <div className="px-tickets">{profile.stats.map(stat => <div className="px-ticket" key={stat.label}><span>{stat.label}</span><b><span data-to={stat.value}>{stat.value}</span>{stat.suffix}</b><small>{stat.en}</small></div>)}</div><div className="px-ticket-shadow"/>
        <div className="px-brand-row"><div className="px-frost-band"/>{projects.map(p => <span key={p.key}>{p.english}</span>)}</div>
      </div>
    </div>
    <div className="px-profile px-wrap"><div className="px-profile-photo px-reveal"><img src="/portrait-andy-cao-square.webp" width="1254" height="1254" alt="曹佳豪个人照片" loading="lazy"/><div><span>曹佳豪 / ANDY CAO</span><span>DESIGN WITH INTENTION</span></div></div>
      <div className="px-profile-copy px-reveal"><Label>HELLO, I'M ANDY.</Label><h2>以品牌为起点，<br/>以产品为主角。</h2><p>{profile.bio}</p><div className="px-inline-contact"><a href={`tel:${profile.phone}`}><Phone size={16}/>{profile.phone}</a><a href={`mailto:${profile.email}`}><Mail size={16}/>{profile.email}</a></div></div>
    </div>
    <div className="px-journey px-wrap px-reveal"><div><Label>THE JOURNEY</Label><h3>每一程，皆有积淀。</h3></div><ol>{experience.map((job,i) => <li key={job.company}><span className="px-job-number">0{i+1}</span><div><h4>{job.company}</h4><p>{job.role}</p></div><time>{job.period}</time></li>)}</ol></div>
  </section>;
}
function Expertise() {
  const [active, setActive] = useState(0);
  return <section id="expertise" className="px-expertise" aria-labelledby="px-expertise-title"><div className="px-loop-cloud" aria-hidden="true"><img className="px-drift-a" src={scenery.cloudA} alt="" loading="lazy"/><span className="px-glass"/></div><div className="px-expertise-head"><Label>03 / WHAT I BRING</Label><h2 id="px-expertise-title" className="px-h2 px-reveal">好看，是起点。<br/><span>有用，才是设计。</span></h2><p>将品牌理解、产品思考与视觉表现连在一起。</p></div>
    <div className="px-track">{abilities.map((item,i) => <article key={item.id} className={`px-panel ${i===active?'is-active':''}`} onMouseEnter={() => setActive(i)}><button className="px-panel-trigger" onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-expanded={i===active} aria-controls={`px-step-${i}`} aria-label={`${item.id} ${item.title}`}><span className="px-panel-label">{item.en}</span><ArrowUpRight size={20}/></button><div className="px-panel-in"><span className="px-panel-number" aria-hidden="true">{i+1}</span><div className="px-step" id={`px-step-${i}`}><span>{item.en}</span><h3>{item.title}</h3><p>{item.text}</p><div className="px-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></div>{i===active && <img className="px-mini-cloud px-drift-b" src={i%2?scenery.cloudA:scenery.cloudB} alt="" loading="lazy"/>}</article>)}</div>
  </section>;
}
function Contact() {
  const [copied, setCopied] = useState('');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async (value, label) => {
    try { await navigator.clipboard.writeText(value); setCopied(label); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(''), 2500); }
    catch { setCopied('复制失败，请选中文本复制'); }
  };
  return <><section id="contact" className="px-contact" aria-labelledby="px-contact-title"><GridField/><div className="px-night"><img src={scenery.night} alt="月光下的樱花山谷与湖泊" loading="lazy"/></div><div className="px-petals" aria-hidden="true">{Array.from({length:18},(_,i) => <span key={i} style={{left:`${(i*37)%100}%`,'--dx':`${(i*29)%160-80}px`,animationDuration:`${9+i%10}s`,animationDelay:`-${i*.83}s`,scale:.6+(i%5)*.2}}/>)}</div>
    <div className="px-contact-card"><Label>04 / THE NEXT CHAPTER</Label><h2 id="px-contact-title">期待下一次，<br/>和你一起创造。</h2><p>一个新的想法，一次新的合作。<br/>从一句「你好」开始。</p><a className="px-btn" href={`mailto:${profile.email}`}>写封邮件给我 <ArrowUpRight size={16}/></a><div className="px-contact-values"><div><a href={`mailto:${profile.email}`}>{profile.email}</a><button onClick={() => copy(profile.email,'邮箱已复制')} aria-label="复制邮箱">{copied==='邮箱已复制'?<Check size={15}/>:<Copy size={15}/>}</button></div><div><a href={`tel:${profile.phone}`}>{profile.phone}</a><button onClick={() => copy(profile.phone,'电话已复制')} aria-label="复制电话">{copied==='电话已复制'?<Check size={15}/>:<Copy size={15}/>}</button></div></div><span className="px-copy-feedback" role="status">{copied}</span><a className="px-contact-pdf" href={portfolioDocument.href} target="_blank" rel="noreferrer">完整作品集 PDF <ArrowUpRight size={15}/></a></div>
  </section><footer className="px-footer"><a href="#home" className="px-footer-brand" aria-label="曹佳豪，回到顶部"><svg className="px-footer-logo" viewBox="0 0 80 80" aria-hidden="true"><circle className="px-ring" cx="40" cy="40" r="37" fill="none" stroke="currentColor" strokeWidth="2.4" transform="rotate(-90 40 40)"/><circle className="px-fdot" cx="22" cy="40" r="4.5"/><circle className="px-fdot" cx="40" cy="40" r="4.5"/><circle className="px-fdot" cx="58" cy="40" r="4.5"/><path className="px-fmark" d="M33 53 43 31 56 53" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/></svg><span>曹佳豪<small>ANDY CAO · DESIGN PORTFOLIO</small></span></a><nav aria-label="底部导航">{navItems.map(([text,href])=><a key={href} href={href}>{text}</a>)}<a href="/">查看暗色版 <ArrowUpRight size={13}/></a></nav><a href="#home" className="px-back-top">回到顶部 <ArrowUp size={16}/></a><small className="px-copyright">© 2026 CAO JIAHAO · DESIGNED WITH INTENTION.</small></footer></>;
}
export default function PetalyxPortfolio() {
  const root = useRef(null);
  usePetalyxMotion(root);
  useEffect(() => {
    const dialog = root.current.querySelector('.project-dialog');
    dialog?.setAttribute('data-lenis-prevent','');
    const font = document.createElement('link'); font.rel='stylesheet'; font.href='https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap'; document.head.append(font);
    return () => { font.remove(); dialog?.removeAttribute('data-lenis-prevent'); };
  }, []);
  return <><div className="px-intro-backdrop" style={{backgroundImage:`url('${scenery.poster}')`}} aria-hidden="true"/><main ref={root} className="px-page"><a className="px-skip" href="#work">跳至精选作品</a><Navigation/><Hero/><About/><ProjectGallery/><Expertise/><Contact/></main></>;
}
