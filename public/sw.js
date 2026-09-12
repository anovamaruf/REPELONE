self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'XII RPL ONE 📸';
  const options = {
    body: data.body || 'Ada momen baru diunggah!',
    icon: '/ikon kelas.PNG',
    badge: '/ikon kelas.PNG',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});