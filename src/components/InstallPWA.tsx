'use client';

import { useEffect, useState } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Cek apakah sudah di-install sebagai PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    // Deteksi jika perangkat iOS (iPhone/iPad)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('Untuk menginstal aplikasi, buka menu titik tiga (⋮) di browser kamu, lalu pilih "Tambahkan ke Layar Utama" atau "Install App".');
    }
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Banner / Tombol Mengapung di bagian bawah */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-40 bg-slate-900/95 border border-sky-400/40 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 max-w-sm mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-sky-950 border border-sky-400/40 flex-shrink-0">
            <img src="/ikon kelas.PNG" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Install Aplikasi XII RPL ONE</h4>
            <p className="text-[10px] text-sky-300 font-mono">Biar gampang diakses dari layar HP!</p>
          </div>
        </div>
        <button
          onClick={handleInstallClick}
          className="bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md whitespace-nowrap flex-shrink-0"
        >
          📱 Install
        </button>
      </div>

      {/* Modal Panduan Khusus Pengguna iPhone (iOS) */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/30 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            <div className="flex justify-end">
              <button onClick={() => setShowIosGuide(false)} className="text-slate-400 hover:text-white text-sm font-bold">✕</button>
            </div>
            <h3 className="text-sm font-bold text-white font-mono">Cara Install di iPhone (Safari)</h3>
            <div className="space-y-3 text-xs text-slate-300 text-left bg-slate-950 p-4 rounded-2xl border border-sky-500/20">
              <p>1. Ketuk ikon <span className="text-sky-400 font-bold">Bagikan (Share)</span> di bagian bawah browser Safari.</p>
              <p>2. Gulir ke bawah lalu cari dan pilih opsi <span className="text-sky-400 font-bold">"Tambah ke Layar Utama" (Add to Home Screen)</span>.</p>
              <p>3. Ketuk <span className="text-sky-400 font-bold">Tambah</span> di pojok kanan atas.</p>
            </div>
            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full bg-sky-400 text-slate-950 font-bold font-mono text-xs py-2.5 rounded-xl hover:bg-sky-300"
            >
              Mengerti 👍
            </button>
          </div>
        </div>
      )}
    </>
  );
}