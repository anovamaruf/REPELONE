'use client';

import { useEffect, useState } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cek apakah sudah di-install sebagai PWA (berjalan dari layar utama)
    const standaloneCheck = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(Boolean(standaloneCheck));

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

  // JIKA SUDAH DI-INSTALL (Standalone Mode): Tampilkan tombol Refresh yang praktis
  if (isStandalone) {
    return (
      <button
        onClick={() => window.location.reload()}
        className="fixed bottom-6 right-6 z-40 bg-slate-900/90 border border-sky-400/40 text-sky-300 hover:text-white text-xs font-mono px-3.5 py-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2 transition-all hover:bg-slate-800 active:scale-95"
        title="Muat Ulang Aplikasi"
      >
        <span>🔄</span> Refresh App
      </button>
    );
  }

  if (!isVisible) return null;

  return (
    <>
      {/* Banner / Tombol Install untuk browser biasa */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-40 bg-slate-900/95 border border-sky-400/40 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 max-w-sm mx-auto">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white w-6 h-6 rounded-full text-xs flex items-center justify-center border border-sky-400/30 shadow-md"
          title="Tutup sementara"
        >
          ✕
        </button>

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

      {/* Modal Panduan iPhone (iOS) */}
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