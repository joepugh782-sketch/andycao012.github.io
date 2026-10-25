import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, X } from 'lucide-react';
import { projects } from './content';
import { useGalleryMotion } from './motion';
import './project-gallery.css';

export default function ProjectGallery() {
  const [category, setCategory] = useState('全部作品');
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const gallery = useRef(null);
  useGalleryMotion(gallery, category);
  useEffect(() => {
    if (!selected) return;
    const node = dialog.current;
    const overflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    node.scrollTop = 0;
    return () => { node.close(); document.body.style.overflow = overflow; };
  }, [selected]);
  const visible = projects.filter(p => category === '全部作品' || p.category === category);
  return <section id="work" className="work section container" aria-labelledby="work-title">
    <div className="section-top"><span className="eyebrow"><span className="tiny-dot" /> 02 / SELECTED WORK</span><span className="section-side">商业表达，也值得认真设计。</span></div>
    <div className="work-heading motion-heading"><div><h2 id="work-title"><span className="motion-title-mask"><span className="motion-title">SELECTED WORK</span></span></h2><span className="profile-subtitle">精选作品</span><p className="heading-description">让视觉的吸引力，连接产品与人。</p></div><span className="outline-number">[ 2026 PORTFOLIO ]</span></div>
    <div className="work-toolbar"><div className="filters" role="group" aria-label="按作品类型筛选">{['全部作品', ...new Set(projects.map(project => project.category))].map(c => <button className={category === c ? 'active' : ''} key={c} onClick={() => setCategory(c)} aria-pressed={category === c}>{c}{c === '全部作品' && <sup>{String(projects.length).padStart(2,'0')}</sup>}</button>)}</div><span className="work-count" aria-live="polite">{String(visible.length).padStart(2,'0')} PROJECTS</span></div>
    <div ref={gallery} className={`projects-grid ${visible.length === 1 ? 'single-project' : ''}`}>
      {visible.map((project) => <article className={`project-card project-${project.key}`} key={project.id}>
        <button className="project-cover" style={{ background: project.color }} onClick={() => setSelected(project)} aria-label={`查看${project.name}项目`}>
          <span className="project-image-reveal"><span className="project-image-depth"><img src={project.cover} width="1080" height="1080" alt={`${project.name}电商设计作品，产品详情及营销视觉`} loading="lazy" /></span></span>
          <span className="project-id">{project.id} / {project.english}</span><span className="project-open"><span>查看项目</span><ArrowUpRight size={21} /></span>
        </button>
        <div className="project-info"><div><div className="project-category">{project.discipline}</div><h3><button onClick={() => setSelected(project)}>{project.name}<ArrowUpRight size={23} /></button></h3><p>{project.title}</p></div><span className="project-name-en">{project.english}</span></div>
      </article>)}
    </div>
    <div className="work-bottom"><span>每一个项目，都是一次新的观察与表达。</span></div>
    <dialog ref={dialog} className="project-dialog" onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }} aria-labelledby="dialog-title">
      {selected && <div className="dialog-content"><div className="dialog-toolbar"><span>{selected.id} / {selected.english}</span><button onClick={() => setSelected(null)} aria-label="关闭项目详情" autoFocus><X size={24} /></button></div>
        <div className="dialog-intro"><span className="eyebrow">PROJECT OVERVIEW</span><h2 id="dialog-title">{selected.name}</h2><p>{selected.description}</p><div className="scope-tags">{selected.scopes.map(s => <span key={s}>{s}</span>)}</div></div>
        <div className="project-pages">{selected.pages.map((page, i) => <img key={page} src={`/projects/${selected.key}-${page}.webp`} alt={`${selected.name}作品展示 ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />)}</div>
        <div className="dialog-end"><p>谢谢观看。</p><button className="text-link" onClick={() => setSelected(null)}>返回作品列表 <ArrowRight size={18}/></button></div>
      </div>}
    </dialog>
  </section>;
}
