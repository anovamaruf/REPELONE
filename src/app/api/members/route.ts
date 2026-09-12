import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MemberBioSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  quote: { type: String, required: true },
  passcode: { type: String, required: true },
  canEdit: { type: Boolean, default: true }, // Kontrol 1x edit (bisa dibuka lagi oleh Admin)
  updatedAt: { type: Date, default: Date.now },
});

const MemberBio = mongoose.models.MemberBio || mongoose.model('MemberBio', MemberBioSchema);

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI belum terpasang!');
  await mongoose.connect(mongoUri);
}

// GET: Ambil daftar bio tersimpan dari MongoDB
export async function GET() {
  try {
    await connectToDatabase();
    const bios = await MemberBio.find();
    return NextResponse.json({ success: true, data: bios });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Update bio siswa berdasarkan verifikasi kata sandi
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, quote, passcode, adminKey } = await req.json();

    if (!name || !quote || !passcode) {
      return NextResponse.json({ success: false, error: 'Data tidak lengkap' }, { status: 400 });
    }

    let member = await MemberBio.findOne({ name });

    // Cek Akses Admin untuk membukan kembali izin edit (Reset edit status)
    if (adminKey && adminKey === 'admin123') {
      if (!member) {
        member = await MemberBio.create({ name, quote, passcode, canEdit: true });
      } else {
        member.canEdit = true;
        await member.save();
      }
      return NextResponse.json({ success: true, message: 'Izin edit diberikan oleh Admin', data: member });
    }

    // Jika member belum ada di database, buat baru
    if (!member) {
      if (passcode !== '12345') {
        return NextResponse.json({ success: false, error: 'Sandi salah!' }, { status: 401 });
      }
      const newMember = await MemberBio.create({ name, quote, passcode, canEdit: false });
      return NextResponse.json({ success: true, data: newMember });
    }

    // Jika member sudah pernah mengedit bio dan belum diizinkan admin
    if (!member.canEdit) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kamu sudah pernah mengedit bio 1 kali. Hubungi Admin (Anova) untuk membuka akses edit!' 
      }, { status: 403 });
    }

    // Verifikasi kata sandi
    if (member.passcode !== passcode && passcode !== '12345') {
      return NextResponse.json({ success: false, error: 'Sandi salah!' }, { status: 401 });
    }

    // Update bio dan kunci akses edit (canEdit = false)
    member.quote = quote;
    member.canEdit = false;
    member.updatedAt = new Date();
    await member.save();

    return NextResponse.json({ success: true, data: member });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}