import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

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

    const newMessage = await Message.create({
      sender: body.sender && body.sender.trim() ? body.sender.trim() : 'Anonim',
      text: body.text.trim(),
    });

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error: any) {
    console.error('API Error POST messages:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan pesan' },
      { status: 500 }
    );
  }
}