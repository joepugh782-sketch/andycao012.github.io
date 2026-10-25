import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, Pause, Play } from 'lucide-react';
import { profile } from './content';
import './hero.css';

export default function Hero() {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (media.matches) video.current?.pause();
      else video.current?.play().catch(() => {});
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  function toggleVideo() {
    if (video.current.paused) video.current.play().catch(() => {});
    else video.current.pause();
  }

  return <section className="hero hero-editorial" id="home" aria-labelledby="hero-title">
    <div className="hero-media" aria-hidden="true">
      <video ref={video} className="hero-video" muted loop playsInline preload="metadata" poster="/hero-poster.webp" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
        <source src="/hero-motion.mp4" type="video/mp4" />
      </video>
      <div className="hero-shade" />
    </div>
    <div className="hero-opening-shutter" aria-hidden="true" />

    <div className="hero-stage container">
      <h1 className="hero-display" id="hero-title"><span className="hero-title-mask"><span className="hero-title-word">DESIGN</span></span></h1>

      <div className="hero-editorial-content">
        <p className="hero-editorial-role">{profile.name} / ANDY CAO<span>电商视觉设计师</span></p>
        <h2><span className="hero-copy-line-mask"><span className="hero-copy-line-inner">让好产品，</span></span><span className="hero-copy-line-mask"><span className="hero-copy-line-inner">被看见。</span></span></h2>
        <p className="hero-editorial-description">以有温度的视觉，连接品牌与每一次心动。</p>
        <div className="hero-editorial-stat">
          <strong>6<span>+</span></strong>
          <div><span>年设计经验</span><small>DESIGN WITH INTENTION</small></div>
        </div>
        <a className="hero-project-link hero-editorial-cta" href="#work"><span>探索我的作品</span><ArrowUpRight size={23} strokeWidth={1.7}/></a>
      </div>

      <p className="hero-editorial-manifesto"><span className="manifesto-line manifesto-line-mask"><span className="manifesto-line-inner"><span>GOOD</span> <span>DESIGN</span></span></span><span className="manifesto-line manifesto-line-mask"><span className="manifesto-line-inner"><span>REAL</span> <span>IMPACT</span></span></span></p>
    </div>

    <div className="hero-bottom container">
      <a href="#about" className="scroll-cue"><span>向下探索 <small>SCROLL TO DISCOVER</small></span><ArrowDown size={15}/></a>
      <span className="hero-edition">CAO JIAHAO / DESIGN PORTFOLIO</span>
      <button className="video-toggle" onClick={toggleVideo} aria-label={playing ? '暂停背景视频' : '播放背景视频'}>{playing ? <Pause size={13}/> : <Play size={13}/>}<span>{playing ? 'PAUSE' : 'PLAY'}</span></button>
    </div>
  </section>;
}
