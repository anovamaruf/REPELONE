import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import webpush from 'web-push';
import PushSubscription from '@/models/PushSubscription';

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@xiirplone.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

const MessageSchema = new mongoose.Schema({
  sender: { type: String, default: 'Anonim' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI belum ada!');
  }
  await mongoose.connect(mongoUri);
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

export async function GET() {
  try {
    await connectToDatabase();
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('API Error GET messages:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengambil pesan' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.text || !body.text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Pesan tidak boleh kosong' },
        { status: 400 }
      );
    }

    const senderName = body.sender && body.sender.trim() ? body.sender.trim() : 'Anonim';
    const newMessage = await Message.create({
      sender: senderName,
      text: body.text.trim(),
    });

    // Kirim Push Notification saat pesan baru dikirim
    await sendPushNotification(
      '💬 Pesan & Kesan Baru',
      `@${senderName} mengirim pesan baru di mading kelas!`,
      '/#pesan-kelas'
    );

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error: any) {
    console.error('API Error POST messages:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan pesan' },
      { status: 500 }
    );
  }
}