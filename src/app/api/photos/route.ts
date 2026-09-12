import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String },
  author: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Photo = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI!);
}

// GET: Mengambil daftar foto untuk ditampilkan di galeri web
export async function GET() {
  try {
    await connectToDatabase();
    const photos = await Photo.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: photos });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Menyimpan URL foto dari Cloudinary ke database
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { imageUrl, caption, author } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'URL Gambar tidak boleh kosong' }, { status: 400 });
    }

    const newPhoto = await Photo.create({
      imageUrl,
      caption: caption || '',
      author: author || 'Anonim',
    });

    return NextResponse.json({ success: true, data: newPhoto });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}