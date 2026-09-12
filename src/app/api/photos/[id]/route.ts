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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { adminKey } = await req.json();

    if (adminKey !== 'admin123') {
      return NextResponse.json({ success: false, error: 'Sandi Admin salah!' }, { status: 401 });
    }

    const deletedPhoto = await Photo.findByIdAndDelete(id);
    if (!deletedPhoto) {
      return NextResponse.json({ success: false, error: 'Foto tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Foto berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}