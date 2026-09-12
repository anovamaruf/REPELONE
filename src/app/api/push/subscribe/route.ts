import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import PushSubscription from '@/models/PushSubscription';

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI!);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const subscription = await req.json();
    
    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      subscription,
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}