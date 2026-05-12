import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'freetup_unlocker_enabled';

function injectStyles() {
  if (!document.getElementById('freetup-blur-override')) {
    const s = document.createElement('style');
    s.id = 'freetup-blur-override';
    s.textContent = `[class*="blur"] { filter: none !important; backdrop-filter: none !important; }`;
    document.head.appendChild(s);
  }
  if (!document.getElementById('freetup-scroll-override')) {
    const s = document.createElement('style');
    s.id = 'freetup-scroll-override';
    s.textContent = `body[data-scroll-locked] { overflow: auto !important; overscroll-behavior: auto !important; }`;
    document.head.appendChild(s);
  }
}

function removeStyles() {
  document.getElementById('freetup-blur-override')?.remove();
  document.getElementById('freetup-scroll-override')?.remove();
}

function oneShotCleanup() {
  document.body.removeAttribute('data-scroll-locked');
  document.querySelectorAll<HTMLElement>('.backdrop-blur-sm').forEach(el => el.remove());
  document.querySelectorAll<HTMLElement>('[role="dialog"][data-slot="modal-content"]').forEach(el => el.remove());
}

export function TogglePaywall() {
  const [enabled, setEnabled] = useState(true);
  const observers = useRef<MutationObserver[]>([]);
  const wheelHandler = useRef<((e: WheelEvent) => void) | null>(null);

  // Load persisted state once on mount
  useEffect(() => {
    browser.storage.local.get(STORAGE_KEY, (result) => {
      const stored = result[STORAGE_KEY];
      // Only apply stored value if it was explicitly set (undefined = first run, default true)
      if (typeof stored === 'boolean') setEnabled(stored);
    });
  }, []);

  // Arm / disarm based on enabled
  useEffect(() => {
    if (enabled) {
      injectStyles();
      oneShotCleanup();

      const attrObserver = new MutationObserver(() => {
        if (document.body.hasAttribute('data-scroll-locked')) {
          document.body.removeAttribute('data-scroll-locked');
        }
      });
      attrObserver.observe(document.body, { attributes: true, attributeFilter: ['data-scroll-locked'] });

      const subtreeObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            if (node.classList.contains('backdrop-blur-sm') || node.matches('[role="dialog"][data-slot="modal-content"]')) {
              node.remove();
            }
            // Also check descendants
            node.querySelectorAll<HTMLElement>('.backdrop-blur-sm, [role="dialog"][data-slot="modal-content"]')
              .forEach(el => el.remove());
          }
        }
      });
      subtreeObserver.observe(document.body, { childList: true, subtree: true });

      observers.current = [attrObserver, subtreeObserver];

      // Intercept wheel events before Meetup's preventDefault listener sees them
      const handler = (e: WheelEvent) => { e.stopImmediatePropagation(); };
      wheelHandler.current = handler;
      window.addEventListener('wheel', handler, { capture: true, passive: false });
    } else {
      observers.current.forEach(o => o.disconnect());
      observers.current = [];
      if (wheelHandler.current) {
        window.removeEventListener('wheel', wheelHandler.current, { capture: true });
        wheelHandler.current = null;
      }
      removeStyles();
    }

    return () => {
      observers.current.forEach(o => o.disconnect());
      observers.current = [];
      if (wheelHandler.current) {
        window.removeEventListener('wheel', wheelHandler.current, { capture: true });
        wheelHandler.current = null;
      }
    };
  }, [enabled]);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    browser.storage.local.set({ [STORAGE_KEY]: next });
  }

  return (
    <button
      onClick={toggle}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999999,
        background: '#FF4B79',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        opacity: 0.4,
        transition: 'background 0.2s, opacity 0.2s ease-in-out',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
    >
      Freetup: {enabled ? 'ON' : 'OFF'}
    </button>
  );
}
