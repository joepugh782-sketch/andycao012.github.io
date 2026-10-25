import { useEffect, useRef } from 'react';
import Grainient from './Grainient';
import './page-background.css';

const COLORS = ['#000000', '#a33511', '#000000', '#8eadcb', '#000000'];

export default function PageBackground() {
  const region = useRef(null);

  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;
    const sync = () => {
      if (region.current) region.current.style.top = `${hero.offsetHeight}px`;
    };
    const observer = new ResizeObserver(sync);
    observer.observe(hero);
    sync();
    return () => observer.disconnect();
  }, []);

  return <div className="page-grainient-region" ref={region} aria-hidden="true">
    <div className="page-grainient-view">
      <Grainient colors={COLORS} angle={48} flow={1.75} silk={0.54}
        grainAmount={0.01} softness={0.56} speed={0.95}
        grainSize={0.6} grainAnimated={false} contrast={1.5} variation={11}
        interactive={false} stir={1.6} clickSwirl={false} dpr={1} />
    </div>
  </div>;
}
