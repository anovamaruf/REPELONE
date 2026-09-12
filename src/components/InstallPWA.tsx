'use client';

import { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true); // Tampilkan popup otomatis
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-slate-900 border border-sky-400/40 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-bounce">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📱</span>
        <div>
          <h4 className="text-xs font-bold text-white font-mono">Pasang Aplikasi XII RPL ONE</h4>
          <p className="text-[10px] text-slate-300">Biar gampang dibuka langsung dari layar utama HP!</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShowPrompt(false)}
          className="text-[10px] text-slate-400 px-2.5 py-1.5 hover:text-white"
        >
          Nanti
        </button>
        <button
          onClick={handleInstallClick}
          className="bg-sky-400 text-slate-950 font-bold text-[10px] px-4 py-2 rounded-xl shadow-md hover:bg-sky-300"
        >
          Install Sekarang
        </button>
      </div>
    </div>
  );
}