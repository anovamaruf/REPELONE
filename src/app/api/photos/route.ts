import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import webpush from 'web-push';
import PushSubscription from '@/models/PushSubscription';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@xiirplone.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const PhotoSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String },
  author: { type: String },
  eventDate: { type: Date }, // Ditambahkan untuk menyimpan tanggal kegiatan pilihan user
  createdAt: { type: Date, default: Date.now },
});
const Photo = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI!);
}

async function sendPushNotification(title: string, body: string, url: string = '/') {
  try {
    const subscriptions = await PushSubscription.find({});
    const notificationPayload = JSON.stringify({ title, body, url });

    const promises = subscriptions.map((sub) =>
      webpush.sendNotification(sub, notificationPayload).catch(async (err: any) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await PushSubscription.deleteOne({ endpoint: sub.endpoint });
        }
      })
    );

    await Promise.all(promises);
  } catch (error) {
    console.error('Error sending push notifications:', error);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { imageUrl, caption, author, eventDate } = body;

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'Image URL is required' }, { status: 400 });
    }

    const newPhoto = await Photo.create({
      imageUrl,
      caption,
      author: author || 'Member',
      eventDate: eventDate ? new Date(eventDate) : new Date(), // Simpan tanggal pilihan atau default hari ini
    });

    const uploaderName = author || 'Seseorang';
    await sendPushNotification(
      'XII RPL ONE 📸',
      `${uploaderName} baru saja mengunggah foto baru di Daily Random Feed!`,
      '/#galeri-daily'
    );

    return NextResponse.json({ success: true, data: newPhoto });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const photos = await Photo.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: photos });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}