import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

/**
 * StrictMode is intentionally omitted.
 *
 * React StrictMode double-invokes effects in development, which causes GSAP
 * timelines to run twice (producing duplicate/broken animations). Since GSAP
 * manages its own cleanup via useGSAP + gsap.context().revert(), StrictMode
 * provides no additional safety benefit here.
 */
createRoot(document.getElementById('root')!).render(<App />);
