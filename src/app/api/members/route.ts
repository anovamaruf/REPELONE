import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MemberBioSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  quote: { type: String, required: true },
  canEdit: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

const MemberBio = mongoose.models.MemberBio || mongoose.model('MemberBio', MemberBioSchema);

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI!);
}

// Daftar NIS resmi sesuai data kelas
const studentNisMap: Record<string, string> = {
  "AHMAD RIZKI FEBRIAN": "24119830",
  "ASMIRA SALVIA": "24119831",
  "BAIQ IZA NURUL AZKIYA": "24119832",
  "BINTANG ARASTI": "24119833",
  "DIANA SUSIANTO": "24119834",
  "DYMAS ALIP PROJO": "24119835",
  "GHITSA RIZKIKA": "24119836",
  "GUFRAN NAPISS": "24119837",
  "I GUSTI BAGUS AGUNG ALIT MAHENDRA": "24119838",
  "I KOMANG ANGGA ADI ARTA": "24119839",
  "I NYOMAN SATIA MAHESA LINGGIH": "24119840",
  "I PUTU ANDRAYUGA PUTRA SUDHANA": "24119841",
  "I WAYAN EKALAYA": "24119842",
  "IDA AYU NYOMAN DWIPA YANTI": "24119843",
  "LALU FAHRIZA ALFARIZKY": "24119845",
  "MADU CITRA LESTARI": "24119846",
  "MAULANA WAIS AL KHARONI": "24119847",
  "MUHAMMAD ANOVA MA'RUF": "24119848",
  "MUHAMMAD AQSHO KHATAMI": "24119849",
  "MUHAMMAD RADJADIN": "24119850",
  "MUHAMMAD WAZIR ISLAMI": "24119851",
  "NADIA": "24119852",
  "NAMIRA HARDI": "24119853",
  "NIKITA MULIANI CANDRA": "24119854",
  "NURHAYANI": "24119855",
  "NURISYA PUTRI": "24119856",
  "PANJIE PRATAMA PUTRA RAHMAN": "24119857",
  "PUTRI AYUDIA CHAIRUNNISA": "24119858",
  "RIZKY ISLAMI PASHYA": "24119859",
  "SELVAN JULIAN PRATAMA": "24119860",
  "SOVIYA KUDUSIYAH": "24119861",
  "SYAMSON TEGUH MULEJATI": "24119862",
  "TIARA": "24119863",
  "ZAHRA TUSSITA": "24119864",
  "ZAINAB MANSHUR": "24119865"
};

// GET: Mengambil semua data bio siswa
export async function GET() {
  try {
    await connectDB();
    const members = await MemberBio.find({});
    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Menyimpan/Memperbarui Bio dengan verifikasi NIS & Admin Key ("081114")
export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, quote, passcode, adminKey } = await req.json();

    if (!name || !quote) {
      return NextResponse.json({ success: false, error: 'Nama dan quote wajib diisi' }, { status: 400 });
    }

    const correctNis = studentNisMap[name];
    const MASTER_ADMIN_KEY = "081114"; // Sandi admin baru

    let isAuthorized = false;

    // Cek apakah yang memasukkan sandi adalah admin utama ("081114")
    if (adminKey && adminKey === MASTER_ADMIN_KEY) {
      isAuthorized = true;
    } 
    // Atau cek apakah passcode yang dimasukkan sesuai dengan NIS siswa bersangkutan
    else if (passcode && passcode === correctNis) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kata sandi salah! Masukkan NIS kamu dengan benar atau gunakan Kunci Admin (081114).' 
      }, { status: 403 });
    }

    // Jika lolos verifikasi, simpan atau update bio ke database
    // canEdit diset false setelah 1x edit (kecuali direset oleh admin)
    const updatedBio = await MemberBio.findOneAndUpdate(
      { name },
      { 
        quote, 
        canEdit: adminKey === MASTER_ADMIN_KEY ? true : false, // Jika admin yang edit, izin bisa direset
        updatedAt: Date.now() 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updatedBio });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}