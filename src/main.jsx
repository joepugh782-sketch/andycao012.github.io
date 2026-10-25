import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.css';
import './styles.css';
import './motion.css';

// The alternative design is opt-in; the original URL keeps its current design.
const petalyx = new URLSearchParams(window.location.search).get('version') === 'petalyx';
document.documentElement.dataset.portfolioVersion = petalyx ? 'petalyx' : 'original';
const App = lazy(() => petalyx ? import('./PetalyxPortfolio.jsx') : import('./App.jsx'));
createRoot(document.getElementById('root')).render(<React.StrictMode><Suspense fallback={<div role="status" style={{padding:32,color:petalyx?'#4d6a10':'#f4f4f4'}}>正在加载作品集…</div>}><App /></Suspense></React.StrictMode>);
