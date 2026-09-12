import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Atur batasan body parser Next.js jika diperlukan (opsional, untuk file besar)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ success: false, error: 'Tidak ada file gambar yang dikirim' }, { status: 400 });
    }

    // Upload langsung string base64 ke Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'repelone_daily',
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
    });
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengunggah gambar ke server' },
      { status: 500 }
    );
  }
}