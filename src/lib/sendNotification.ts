import webpush from 'web-push';
import { dbConnect } from '@/lib/mongodb'; // Diperbarui menggunakan named export
import PushSubscription from '@/models/PushSubscription';

// Inisialisasi VAPID details jika belum
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@xiirplone.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function sendPushNotification(title: string, body: string, url: string = '/') {
  try {
    await dbConnect();
    const subscriptions = await PushSubscription.find({});

    const payload = JSON.stringify({
      title,
      body,
      url,
    });

    // Kirim notifikasi ke semua perangkat yang subscribe secara paralel
    const notifications = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          payload
        );
      } catch (error: any) {
        // Jika endpoint sudah tidak valid/expired, hapus dari database
        if (error.statusCode === 410 || error.statusCode === 404) {
          await PushSubscription.deleteOne({ endpoint: sub.endpoint });
        }
      }
    });

    await Promise.all(notifications);
  } catch (err) {
    console.error('Error sending push notification:', err);
  }
}