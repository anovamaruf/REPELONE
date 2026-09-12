import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true }, // Judul kegiatan
  description: { type: String },          // Deskripsi kegiatan
  createdAt: { type: Date, default: Date.now },
});

const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI!);
}

// GET: Mengambil daftar galeri kegiatan
export async function GET() {
  try {
    await connectToDatabase();
    const activities = await Activity.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: activities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Menambah galeri kegiatan baru
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { imageUrl, title, description } = await req.json();

    if (!imageUrl || !title) {
      return NextResponse.json({ success: false, error: 'Gambar dan Judul Kegiatan wajib diisi!' }, { status: 400 });
    }

    const newActivity = await Activity.create({
      imageUrl,
      title,
      description: description || '',
    });

    return NextResponse.json({ success: true, data: newActivity });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}