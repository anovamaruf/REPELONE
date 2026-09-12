'use client';

interface AboutSectionProps {
  photoUrl?: string;
  totalStudents?: number;
  totalMemories?: string;
  classBatch?: string;
}

export default function AboutSection({
  photoUrl = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80", // Ganti dengan URL foto kelas kalian
  totalStudents = 35,
  totalMemories = "100+",
  classBatch = "2026"
}: AboutSectionProps) {
  return (
    <section id="tentang" className="reveal-item max-w-4xl mx-auto px-6 py-10">
      <div className="bg-slate-900/60 border border-sky-500/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        
        {/* Banner Foto Bersama Kelas */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 group">
          <img
            src={photoUrl}
            alt="Foto Bersama XII RPL ONE"
            className="w-full h-56 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
            <span className="text-xs font-mono text-sky-300 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-sky-400/30">
              #TechcraftersMemory
            </span>
          </div>
        </div>

        {/* Deskripsi & Judul Tentang Kami */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Siapa Kami?</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
            <strong>XII RPL ONE (Techcrafters)</strong> adalah angkatan Rekayasa Perangkat Lunak 1. Didedikasikan untuk mengasah kemampuan programming, inovasi teknologi, dan membangun ikatan keluarga kelas yang solid dengan passion yang sama di dunia digital.
          </p>
        </div>

        {/* Counter Statistik Baru (Diperbarui) */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-sky-500/20 font-mono text-center">
          <div className="bg-slate-950/60 border border-sky-500/20 p-3.5 sm:p-4 rounded-2xl flex flex-col justify-center">
            <span className="text-2xl sm:text-3xl font-black text-sky-400">{totalStudents}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1">Siswa Aktif</span>
          </div>
          <div className="bg-slate-950/60 border border-sky-500/20 p-3.5 sm:p-4 rounded-2xl flex flex-col justify-center">
            <span className="text-2xl sm:text-3xl font-black text-blue-300">{totalMemories}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1">Momen Kenangan</span>
          </div>
          <div className="bg-slate-950/60 border border-sky-500/20 p-3.5 sm:p-4 rounded-2xl flex flex-col justify-center">
            <span className="text-2xl sm:text-3xl font-black text-white">{classBatch}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1">Tahun Angkatan</span>
          </div>
        </div>

      </div>
    </section>
  );
}