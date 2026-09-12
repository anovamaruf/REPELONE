'use client';

import { useEffect, useState } from 'react';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Cek apakah aplikasinya sudah di-install ke layar utama
    const standaloneCheck = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(Boolean(standaloneCheck));

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) setIsSubscribed(true);
      });
    }
  }, []);

  const subscribeButton = async () => {
    if (!('serviceWorker' in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Izin notifikasi ditolak!');
      return;
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) return;

    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    setIsSubscribed(true);
    alert('Notifikasi berhasil diaktifkan! Kamu akan mendapat info saat ada foto baru.');
  };

  // KUNCI UTAMA: Jangan tampilkan banner notifikasi jika aplikasinya BELUM di-install (belum standalone)
  if (!isStandalone || isSubscribed || !isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 bg-slate-900/95 border border-sky-400/40 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 max-w-xs">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white w-6 h-6 rounded-full text-xs flex items-center justify-center border border-sky-400/30 shadow-md"
        title="Tutup sementara"
      >
        ✕
      </button>

      <span className="text-2xl flex-shrink-0">🔔</span>
      <div className="flex-1">
        <p className="text-xs font-bold text-white">Aktifkan Notifikasi</p>
        <p className="text-[10px] text-sky-200/90 leading-tight mt-0.5">Biar tahu pas ada yang upload foto baru!</p>
      </div>
      <button
        onClick={subscribeButton}
        className="bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md flex-shrink-0"
      >
        Aktifkan
      </button>
    </div>
  );
}