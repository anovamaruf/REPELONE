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

  useEffect(() => {
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

  if (isSubscribed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-sky-950 border border-sky-400 p-3 rounded-2xl shadow-xl flex items-center gap-3">
      <span className="text-xl">🔔</span>
      <div>
        <p className="text-xs font-bold text-white">Aktifkan Notifikasi</p>
        <p className="text-[10px] text-sky-200">Biar tahu pas ada yang upload foto baru!</p>
      </div>
      <button
        onClick={subscribeButton}
        className="bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl"
      >
        Aktifkan
      </button>
    </div>
  );
}