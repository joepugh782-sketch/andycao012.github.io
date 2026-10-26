import { useEffect, useRef, useState } from 'react';
import Grainient from './Grainient';
import './page-background.css';

const COLORS = ['#000000', '#a33511', '#000000', '#8eadcb', '#000000'];

export default function PageBackground() {
  const region = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const sync = () => setPaused(Boolean(document.querySelector('.project-dialog[open]')));
    const onDialogChange = event => {
      if (event.target.matches?.('.project-dialog')) sync();
    };
    sync();
    // Keep the last background frame under the frosted modal. Rendering WebGL
    // through its full-screen blur while the long project scrolls causes churn.
    document.addEventListener('toggle', onDialogChange, true);
    document.addEventListener('close', onDialogChange, true);
    return () => {
      document.removeEventListener('toggle', onDialogChange, true);
      document.removeEventListener('close', onDialogChange, true);
    };
  }, []);

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
        paused={paused}
        grainAmount={0.01} softness={0.56} speed={0.95}
        grainSize={0.6} grainAnimated={false} contrast={1.5} variation={11}
        interactive={false} stir={1.6} clickSwirl={false} dpr={1} />
    </div>
  </div>;
}
