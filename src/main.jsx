import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 1. Unregister all service workers & purge offline cache (App must NOT run offline)
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  }

  // 2. Turn off debug mode in production (Block console logs and debug dumps)
  if (import.meta.env.PROD) {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
  }
}

// Prevent Chrome/Safari mobile browser pull-to-refresh when sliding down at top of page
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  if (e.touches && e.touches.length === 1) {
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches.length === 1) {
    const touchCurrentY = e.touches[0].clientY;
    const isPullingDown = touchCurrentY > touchStartY;
    const isAtTop = window.scrollY <= 0 && document.documentElement.scrollTop <= 0;

    if (isAtTop && isPullingDown) {
      let target = e.target;
      let hasScrollableParent = false;
      while (target && target !== document.body && target !== document.documentElement) {
        if (target.scrollHeight > target.clientHeight) {
          const overflowY = window.getComputedStyle(target).overflowY;
          if ((overflowY === 'auto' || overflowY === 'scroll') && target.scrollTop > 0) {
            hasScrollableParent = true;
            break;
          }
        }
        target = target.parentElement;
      }

      if (!hasScrollableParent && e.cancelable) {
        e.preventDefault();
      }
    }
  }
}, { passive: false });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
