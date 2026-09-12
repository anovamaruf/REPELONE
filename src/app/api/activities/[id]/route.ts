import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

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

    const deleted = await Activity.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Kegiatan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Kegiatan berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}