import React, { useState, useEffect, useRef } from 'react';

export default function LinkPreview({ url }) {
  const [showCancel, setShowCancel] = useState(false);
  const [closed,     setClosed]     = useState(false);
  const timerRef = useRef(null);

  let domain = '';
  try { domain = new URL(url).hostname.replace('www.', ''); } catch {}

  // Start cancel timer on mount
  useEffect(() => {
    timerRef.current = setTimeout(() => setShowCancel(true), 7000);
    return () => clearTimeout(timerRef.current);
  }, []);

  function handleClose(e) {
    e.stopPropagation();
    setClosed(true);
    clearTimeout(timerRef.current);
  }

  function handleTap() {
    // Open in real browser
    window.open(url, '_blank');
  }

  if (closed) return null;

  return (
    <div className="mx-3 mb-3">
      <div
        className="relative w-full rounded-xl overflow-hidden border border-border bg-black cursor-pointer"
        style={{ height: 320 }}
        onClick={handleTap}
      >
        {/* iframe — auto loads, pointer-events off so tap goes to onClick above */}
        <iframe
          src={url}
          title="link preview"
          className="w-full h-full pointer-events-none"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          allow="autoplay; encrypted-media"
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-2 bg-black/75 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-xs text-blue-400 truncate flex-1">🔗 {domain}</span>
          <span className="text-xs text-gray-500 flex-shrink-0">Tap to open</span>
          {showCancel && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Countdown bar */}
        {!showCancel && <CountdownBar duration={7000} />}
      </div>
    </div>
  );
}

function CountdownBar({ duration }) {
  const [width, setWidth] = useState(100);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setWidth(remaining);
      if (remaining === 0) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-800">
      <div
        className="h-full bg-amber-500 transition-none"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
