'use client';

import { useState } from 'react';

interface UploadModalProps {
  onSuccess: () => void;
}

export default function UploadModal({ onSuccess }: UploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [caption, setCaption] = useState('');
  const [eventDate, setEventDate] = useState(''); // State untuk tanggal kegiatan
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
    setAuthor('');
    setCaption('');
    setEventDate('');
    setIsOpen(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      // 1. Kirim string Base64 gambar ke API backend route kita
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedImage }),
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) throw new Error(uploadData.error || 'Gagal upload gambar ke Cloudinary');

      // 2. Simpan URL Cloudinary & eventDate yang didapat ke database Photos
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadData.url,
          author: author.trim() || 'Anonim',
          caption: caption.trim(),
          eventDate: eventDate || undefined, // Kirim tanggal pilihan user
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Momen berhasil dibagikan!');
        onSuccess();
        handleClose();
      } else {
        alert(data.error || 'Gagal menyimpan momen ke database');
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs px-5 py-3.5 rounded-2xl shadow-xl shadow-sky-400/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
      >
        <span>📸</span> Unggah Foto Kelas
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/30 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono">Tambah Momen Kelas</h3>
              <button onClick={handleClose} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            {!selectedImage ? (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-sky-500/30 rounded-2xl p-6 text-center space-y-3 bg-slate-950/50">
                  <p className="text-xs text-slate-300">Pilih foto atau gambar dokumentasi dari perangkatmu.</p>
                  <label className="inline-block bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl cursor-pointer transition-all shadow-md">
                    📁 Pilih File Gambar dari Perangkat
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-sky-500/30">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-sky-300 block mb-1">Nama Pengunggah:</label>
                  <input
                    type="text"
                    placeholder="Nama kamu..."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-sky-300 block mb-1">Keterangan / Caption:</label>
                  <input
                    type="text"
                    placeholder="Lagi ngapain nih..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full bg-slate-950 border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                {/* Input Tanggal Kegiatan */}
                <div>
                  <label className="text-[10px] font-mono text-sky-300 block mb-1">Tanggal Kegiatan (Opsional):</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-950 border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-xl font-mono"
                  >
                    Pilih File Lain
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-1/2 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs py-2 rounded-xl font-mono shadow-md disabled:opacity-50"
                  >
                    {isUploading ? 'Mengunggah...' : '🚀 Upload Momen'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}