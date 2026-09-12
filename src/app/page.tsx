'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import AboutSection from '@/components/AboutSection';
import UploadModal from '@/components/UploadModal';
import InstallPWA from '@/components/InstallPWA';
import PushNotificationManager from '@/components/PushNotificationManager';

interface Photo {
  _id: string;
  imageUrl: string;
  caption?: string;
  author?: string;
  createdAt: string;
}

interface ActivityItem {
  _id: string;
  imageUrl: string;
  title: string;
  description?: string;
  createdAt: string;
}

interface MessageItem {
  _id?: string;
  sender: string;
  text: string;
  createdAt?: string;
}

interface MemberBioData {
  name: string;
  quote: string;
  canEdit: boolean;
}

const homeroomTeacher = {
  name: 'Baiq Syafira Noor Zahriana, S.Pd',
  role: 'Wali Kelas / Pembimbing',
  avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228999/wali_kelas.jpg',
  quote: '"Membimbing dengan hati, mencetak generasi RPL unggulan."',
};

const classExecutivesInitial = [
  { name: 'NIKITA MULIANI CANDRA', role: 'Ketua Kelas', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228130/niki.jpg', quote: '"Memimpin dengan keteladanan, ketegasan, dan kebersamaan."', instagram: 'https://instagram.com/' },
  { name: 'SYAMSON TEGUH MULEJATI', role: 'Wakil Ketua Kelas', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228132/samson.jpg', quote: '"Stay calm, tetap solid, dan keep coding!"', instagram: 'https://instagram.com/' },
  { name: 'ZAINAB MANSHUR', role: 'Sekretaris', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228134/zain.jpg', quote: '"Mencatat setiap agenda & momen kelas secara teliti dan rapi."', instagram: 'https://instagram.com/' },
  { name: 'IDA AYU NYOMAN DWIPA YANTI', role: 'Bendahara', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228131/dayu.jpg', quote: '"Keuangan transparan, jangan lupa bayar uang kas tepat waktu!"', instagram: 'https://instagram.com/' },
  { name: 'I PUTU ANDRAYUGA PUTRA SUDHANA', role: 'Keamanan', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228130/andra.jpg', quote: '"Menjaga ketertiban dan kenyamanan belajar di kelas."', instagram: 'https://instagram.com/' },
  { name: 'MADU CITRA LESTARI', role: 'Keamanan', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228134/madu.jpg', quote: '"Kedisiplinan dan kekeluargaan adalah kunci keharmonisan."', instagram: 'https://instagram.com/' },
];

const classMembersInitial = [
  { name: 'AHMAD RIZKI FEBRIAN', quote: '"Code modern, solusi cerdas."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228132/riski_febrian.jpg', instagram: 'https://instagram.com/' },
  { name: 'ASMIRA SALVIA', quote: '"Tetap tersenyum di setiap error syntax."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228131/asmira.jpg', instagram: 'https://instagram.com/' },
  { name: 'BAIQ IZA NURUL AZKIYA', quote: '"Belajar tanpa henti untuk masa depan."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228133/iza.jpg', instagram: 'https://instagram.com/' },
  { name: 'BINTANG ARASTI', quote: '"Bintang kelas di dunia programming."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228131/bintang.jpg', instagram: 'https://instagram.com/' },
  { name: 'DIANA SUSIANTO', quote: '"Mewujudkan impian satu per satu."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228132/diana.jpg', instagram: 'https://instagram.com/' },
  { name: 'DYMAS ALIP PROJO', quote: '"Debugging hidup dengan kesabaran."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228131/dimas.jpg', instagram: 'https://instagram.com/' },
  { name: 'GHITSA RIZKIKA', quote: '"Semangat dan selalu berikan yang terbaik."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228133/gitsa.jpg', instagram: 'https://instagram.com/' },
  { name: 'GUFRAN NAPISS', quote: '"Fokus pada proses dan hasil akhir."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228132/gupron.jpg', instagram: 'https://instagram.com/' },
  { name: 'I GUSTI BAGUS AGUNG ALIT MAHENDRA', quote: '"Soliditas tanpa batas di XII RPL ONE."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228133/hendra.jpg', instagram: 'https://instagram.com/' },
  { name: 'I KOMANG ANGGA ADI ARTA', quote: '"Pantang menyerah sebelum program jalan."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228130/angga.jpg', instagram: 'https://instagram.com/' },
  { name: 'I NYOMAN SATIA MAHESA LINGGIH', quote: '"Harmoni dalam kodingan dan pertemanan."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228133/esa.jpg', instagram: 'https://instagram.com/' },
  { name: 'I WAYAN EKALAYA', quote: '"Fokus pada cita-cita dan karya."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228132/eka.jpg', instagram: 'https://instagram.com/' },
  { name: 'JUMAWARNI NASKIA', quote: '"Kebersamaan adalah kunci keberhasilan."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228131/ayaq.jpg', instagram: 'https://instagram.com/' },
  { name: 'LALU FAHRIZA ALFARIZKY', quote: '"Terus berkembang di era teknologi."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228132/riza.jpg', instagram: 'https://instagram.com/' },
  { name: 'MAULANA WAIS AL KHARONI', quote: '"Simpel, efektif, dan bermanfaat."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228134/maulana.jpg', instagram: 'https://instagram.com/' },
  { name: 'MUHAMMAD ANOVA MA\'RUF', quote: '"Gagal coba lagi, error perbaiki."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228134/m_anova.jpg', instagram: 'https://instagram.com/' },
  { name: 'MUHAMMAD AQSHO KHATAMI', quote: '"Konsistensi adalah kunci sukses sejati."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228130/aqso.jpg', instagram: 'https://instagram.com/' },
  { name: 'MUHAMMAD RADJADIN', quote: '"Berpikir kritis, bertindak tepat."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228132/radin.jpg', instagram: 'https://instagram.com/' },
  { name: 'MUHAMMAD WAZIR ISLAMI', quote: '"Mengukir sejarah manis bersama RPL 1."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228133/wazir.jpg', instagram: 'https://instagram.com/' },
  { name: 'NADIA', quote: '"Jadikan setiap hari penuh makna."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228130/nadia.jpg', instagram: 'https://instagram.com/' },
  { name: 'NAMIRA HARDI', quote: '"Kreativitas tanpa batas di kelas RPL."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228130/mira.jpg', instagram: 'https://instagram.com/' },
  { name: 'NURHAYANI', quote: '"Belajar hari ini, memimpin esok hari."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228131/nuris.jpg', instagram: 'https://instagram.com/' },
  { name: 'NURISYA PUTRI', quote: '"Tetap rendah hati dan terus belajar."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228131/nuris.jpg', instagram: 'https://instagram.com/' },
  { name: 'PANJIE PRATAMA PUTRA RAHMAN', quote: '"Teknologi untuk masa depan yang lebih baik."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228131/panjie.jpg', instagram: 'https://instagram.com/' },
  { name: 'PUTRI AYUDIA CHAIRUNNISA', quote: '"Bercita-cita tinggi dan berusaha gigih."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228131/putri.jpg', instagram: 'https://instagram.com/' },
  { name: 'RIZKY ISLAMI PASHYA', quote: '"Sukses butuh proses dan kerja keras."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228132/riski_pashya.jpg', instagram: 'https://instagram.com/' },
  { name: 'SELVAN JULIAN PRATAMA', quote: '"Selalu ada jalan untuk setiap tantangan."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228133/selvan.jpg', instagram: 'https://instagram.com/' },
  { name: 'SOVIYA KUDUSIYAH', quote: '"Kebaikan kecil berdampak besar."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228133/soviya.jpg', instagram: 'https://instagram.com/' },
  { name: 'TIARA', quote: '"Terus bersinar bersama teman-teman."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228133/tiara.jpg', instagram: 'https://instagram.com/' },
  { name: 'ZAHRA TUSSITA', quote: '"Manisnya perjuangan akan terasa di akhir."', avatar: 'https://res.cloudinary.com/fybbrdcq/image/upload/v1789228134/zahra.jpg', instagram: 'https://instagram.com/' },
].map((member) => ({
  ...member,
  role: 'Anggota Kelas',
}));

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [dbBios, setDbBios] = useState<Record<string, MemberBioData>>({});
  
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actDescription, setActDescription] = useState('');
  const [actFile, setActFile] = useState<string | null>(null);
  const [isUploadingAct, setIsUploadingAct] = useState(false);
  
  // State untuk Preview / Zoom Foto Pop-up (Lightbox)
  const [activePhotoModal, setActivePhotoModal] = useState<{ imageUrl: string; title?: string; description?: string; caption?: string; author?: string } | null>(null);

  const [selectedMember, setSelectedMember] = useState<{ name: string; currentQuote: string } | null>(null);
  const [inputQuote, setInputQuote] = useState('');
  const [inputPasscode, setInputPasscode] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [isSavingBio, setIsSavingBio] = useState(false);

  const [newMessage, setNewMessage] = useState('');
  const [newSender, setNewSender] = useState('');
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const backsoundAudioUrl = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3";

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      if (data.success) setPhotos(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activities');
      const data = await res.json();
      if (data.success) setActivities(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBios = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.success) {
        const bioMap: Record<string, MemberBioData> = {};
        data.data.forEach((item: any) => {
          bioMap[item.name] = { name: item.name, quote: item.quote, canEdit: item.canEdit };
        });
        setDbBios(bioMap);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchActivities();
    fetchMessages();
    fetchBios();

    if (containerRef.current) {
      gsap.fromTo(
        '.reveal-item',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
      );
    }
  }, []);

  const handleSaveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !inputQuote.trim() || !inputPasscode.trim()) return;

    setIsSavingBio(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedMember.name,
          quote: inputQuote.trim(),
          passcode: inputPasscode.trim(),
          adminKey: adminKey.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Bio berhasil diperbarui!');
        setSelectedMember(null);
        setInputQuote('');
        setInputPasscode('');
        setAdminKey('');
        fetchBios();
      } else {
        alert(data.error || 'Gagal menyimpan bio');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan koneksi');
    } finally {
      setIsSavingBio(false);
    }
  };

  const handleDeletePhoto = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah modal pop-up ikut terbuka saat tombol hapus diklik
    const password = prompt('Masukkan Sandi Admin untuk menghapus foto ini:');
    if (!password) return;

    try {
      const res = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey: password }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Foto berhasil dihapus!');
        fetchPhotos();
      } else {
        alert(data.error || 'Sandi admin salah!');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan');
    }
  };

  const handleDeleteActivity = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah modal pop-up ikut terbuka saat tombol hapus diklik
    const password = prompt('Masukkan Sandi Admin untuk menghapus kegiatan ini:');
    if (!password) return;

    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey: password }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Kegiatan berhasil dihapus!');
        fetchActivities();
      } else {
        alert(data.error || 'Sandi admin salah!');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan');
    }
  };

  const handleUploadActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actFile || !actTitle.trim()) return;

    setIsUploadingAct(true);
    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: actFile }),
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error || 'Gagal upload gambar');

      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadData.url,
          title: actTitle.trim(),
          description: actDescription.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Dokumentasi Kegiatan berhasil ditambahkan!');
        setActFile(null);
        setActTitle('');
        setActDescription('');
        setIsActivityModalOpen(false);
        fetchActivities();
      } else {
        alert(data.error || 'Gagal menyimpan kegiatan');
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setIsUploadingAct(false);
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((err) => {
        console.error("Audio playback error:", err);
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSubmittingMessage(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: newSender.trim() || 'Anonim',
          text: newMessage.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewMessage('');
        setNewSender('');
        fetchMessages();
      } else {
        alert(`Gagal mengirim pesan: ${data.error || 'Terjadi kesalahan'}`);
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan jaringan: ${err.message}`);
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-white font-sans pb-28 selection:bg-sky-400 selection:text-slate-950">
      
      <audio ref={audioRef} loop src={backsoundAudioUrl} />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-sky-500/15 blur-[140px] pointer-events-none -z-10" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-sky-500/20 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-sky-400/40 shadow-md shadow-sky-400/20 bg-slate-900 flex-shrink-0">
            <img src="/ikon kelas.PNG" alt="Ikon Kelas" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wide text-white">XII RPL ONE</h1>
            <p className="text-[10px] text-sky-300 font-mono tracking-widest uppercase">@techcrafterc</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-lg border transition-all ${
              isPlayingMusic
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse'
                : 'bg-sky-950/60 border-sky-400/30 text-sky-300 hover:border-sky-400'
            }`}
          >
            <span>{isPlayingMusic ? '🔊' : '🎵'}</span>
            <span>{isPlayingMusic ? 'Pause Backsound' : 'Play Backsound'}</span>
          </button>

          <a
            href="https://www.instagram.com/techcrafterc_class?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-sky-300 bg-sky-950/60 border border-sky-400/30 px-3 py-1.5 rounded-lg hover:border-sky-400 transition-colors"
          >
            Instagram ↗
          </a>
          
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-300 hover:text-sky-400 transition-colors"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 9h16.5m-16.5 6h16.5" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="bg-slate-900/95 border-b border-sky-500/20 px-8 py-5 space-y-3 text-xs tracking-widest font-mono text-slate-300 backdrop-blur-2xl">
          <a href="#beranda" onClick={() => setMenuOpen(false)} className="block hover:text-sky-400">/ BERANDA</a>
          <a href="#tentang" onClick={() => setMenuOpen(false)} className="block hover:text-sky-400">/ SIAPA KAMI</a>
          <a href="#wali-kelas" onClick={() => setMenuOpen(false)} className="block hover:text-sky-400">/ WALI KELAS</a>
          <a href="#pengurus" onClick={() => setMenuOpen(false)} className="block hover:text-sky-400">/ PENGURUS & KEAMANAN</a>
          <a href="#anggota" onClick={() => setMenuOpen(false)} className="block hover:text-sky-400">/ ANGGOTA KELAS</a>
          <a href="#galeri-kegiatan" onClick={() => setMenuOpen(false)} className="block hover:text-sky-400">/ GALERI KEGIATAN KELAS</a>
          <a href="#galeri-daily" onClick={() => setMenuOpen(false)} className="block hover:text-sky-400">/ DAILY RANDOM FEED</a>
          <a href="#pesan-kelas" onClick={() => setMenuOpen(false)} className="block hover:text-sky-400">/ PESAN & KESAN</a>
          <button onClick={() => { toggleMusic(); setMenuOpen(false); }} className="block text-emerald-400 pt-2 border-t border-slate-800 font-mono text-left w-full">
            {isPlayingMusic ? '⏸ PAUSE MUSIC' : '▶ PLAY BACKSOUND MUSIC'}
          </button>
          <a href="https://www.instagram.com/techcrafterc_class?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="block text-sky-400">FOLLOW INSTAGRAM ↗</a>
        </nav>
      )}

      {/* Hero Section */}
      <section id="beranda" className="reveal-item px-6 pt-16 pb-10 text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/80 border border-sky-400/30 text-sky-300 text-xs tracking-wider uppercase font-mono">
          TECHCRAFTERS OFFICIAL PORTAL
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Uniting Code & Creativity <br />
          <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-white bg-clip-text text-transparent">
            Creation of Memory
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-light">
          Satu atap, sejuta cerita, dan ikatan keluarga yang tak akan pernah pudar.
        </p>
        <p className="">
          <strong className="text-white font-semibold">XII RPL ONE</strong>.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3 overflow-x-auto py-2">
          <a href="#galeri-kegiatan" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md whitespace-nowrap">📁 Galeri Kegiatan</a>
          <a href="#galeri-daily" className="bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-sky-400/20 whitespace-nowrap">Daily Random Feed</a>
          <a href="#tentang" className="bg-slate-900 border border-sky-500/20 hover:border-sky-400 text-sky-300 font-semibold text-xs px-5 py-2 rounded-xl transition-all whitespace-nowrap shadow-sm">About Us</a>
          <a href="#pesan-kelas" className="bg-slate-900 border border-sky-500/20 hover:border-sky-400 text-sky-300 text-xs px-4 py-2 rounded-xl transition-all whitespace-nowrap">💬 Pesan Anonim</a>
        </div>
      </section>

      {/* Section 1: Siapa Kami */}
      <AboutSection 
        photoUrl="https://res.cloudinary.com/fybbrdcq/image/upload/v1789231162/rame_sm_pa_mubin.jpg"
        totalStudents={35}
        totalMemories="100+"
        classBatch="2024"
      />

      {/* Section 2: WALI KELAS */}
      <section id="wali-kelas" className="reveal-item max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h2 className="text-xs font-mono text-sky-400 uppercase tracking-widest">Pembimbing</h2>
          <h3 className="text-2xl font-bold text-white tracking-tight mt-1">Wali Kelas Kami</h3>
        </div>

        <div className="bg-slate-900/60 border border-sky-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
          <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden bg-slate-800 border-2 border-sky-400/40 flex-shrink-0 shadow-lg shadow-sky-500/10">
            <img 
              src={homeroomTeacher.avatar} 
              alt={homeroomTeacher.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(homeroomTeacher.name)}`;
              }}
            />
          </div>
          <div className="text-center sm:text-left space-y-2">
            <span className="text-xs font-mono text-sky-300 bg-sky-950 border border-sky-400/30 px-3 py-1 rounded-full inline-block">
              {homeroomTeacher.role}
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-white">{homeroomTeacher.name}</h4>
            <p className="text-xs sm:text-sm text-sky-300/90 font-mono italic">
              {homeroomTeacher.quote}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed pt-1">
              Membimbing dan memotivasi seluruh 36 siswa XII RPL ONE (Techcrafters) agar terus berprestasi dan menjaga kebersamaan.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: PENGURUS & KEAMANAN KELAS */}
      <section id="pengurus" className="reveal-item max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h2 className="text-xs font-mono text-sky-400 uppercase tracking-widest">Struktur Organisasi</h2>
          <h3 className="text-2xl font-bold text-white tracking-tight mt-1">Pengurus & Keamanan Kelas</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classExecutivesInitial.map((executive, idx) => {
            const liveQuote = dbBios[executive.name]?.quote || executive.quote;
            const canEdit = dbBios[executive.name] ? dbBios[executive.name].canEdit : true;

            return (
              <div key={idx} className="bg-slate-900 border border-sky-500/20 rounded-2xl p-4 text-center space-y-3 hover:border-sky-400/60 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-24 h-28 rounded-xl overflow-hidden bg-slate-800 border border-sky-400/30 mx-auto">
                    <img 
                      src={executive.avatar} 
                      alt={executive.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(executive.name)}`;
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block font-semibold">
                      {executive.role}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{executive.name}</h4>
                    <p className="text-[11px] text-sky-300/90 font-light italic mt-1.5 leading-snug">
                      {liveQuote}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 mt-2">
                  <button
                    onClick={() => {
                      setSelectedMember({ name: executive.name, currentQuote: liveQuote });
                      setInputQuote(liveQuote);
                    }}
                    className={`w-full text-[10px] font-mono py-1 rounded-lg border transition-all ${
                      canEdit
                        ? 'bg-sky-500/20 border-sky-400/40 text-sky-300 hover:bg-sky-400 hover:text-slate-950'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400'
                    }`}
                  >
                    {canEdit ? '✏️ Edit Bio (1x Edit)' : '🔒 Bio Terkunci'}
                  </button>

                  <a
                    href={executive.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1 text-[11px] font-mono text-sky-300 bg-sky-950/60 border border-sky-400/30 py-1 px-3 rounded-lg hover:bg-sky-400 hover:text-slate-950 transition-colors w-full"
                  >
                    Instagram ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 4: ANGGOTA KELAS */}
      <section id="anggota" className="reveal-item max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h2 className="text-xs font-mono text-sky-400 uppercase tracking-widest">Direktori Siswa (30 Anggota)</h2>
          <h3 className="text-2xl font-bold text-white tracking-tight mt-1">Anggota XII RPL ONE</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {classMembersInitial.map((member, idx) => {
            const liveQuote = dbBios[member.name]?.quote || member.quote;
            const canEdit = dbBios[member.name] ? dbBios[member.name].canEdit : true;

            return (
              <div key={idx} className="bg-slate-900 border border-sky-500/20 rounded-2xl p-3 text-center space-y-2 hover:border-sky-400/60 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-full h-36 bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.name)}`;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{member.name}</h4>
                    <p className="text-[10px] text-sky-400 font-mono">Anggota Kelas</p>
                    <p className="text-[10px] text-slate-300 italic line-clamp-2 mt-1 font-light leading-tight">
                      {liveQuote}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <button
                    onClick={() => {
                      setSelectedMember({ name: member.name, currentQuote: liveQuote });
                      setInputQuote(liveQuote);
                    }}
                    className={`w-full text-[9px] font-mono py-1 rounded-lg border transition-all ${
                      canEdit
                        ? 'bg-sky-500/20 border-sky-400/40 text-sky-300 hover:bg-sky-400 hover:text-slate-950'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400'
                    }`}
                  >
                    {canEdit ? '✏️ Edit Bio (1x)' : '🔒 Bio Terkunci'}
                  </button>

                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1 text-[10px] font-mono text-sky-300 bg-sky-950/60 border border-sky-400/30 py-1 px-2 rounded-lg hover:bg-sky-400 hover:text-slate-950 transition-colors w-full"
                  >
                    Instagram ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal Popup Edit Bio */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/30 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono">Edit Bio: {selectedMember.name}</h3>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveBio} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-sky-300 block mb-1">Bio / Quote Baru Kamu:</label>
                <textarea
                  value={inputQuote}
                  onChange={(e) => setInputQuote(e.target.value)}
                  rows={3}
                  required
                  placeholder="Tuliskan kata-kata atau quote unik kamu..."
                  className="w-full bg-slate-950 border border-sky-500/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-400 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-sky-300 block mb-1">Kata Sandi (NIS Kamu):</label>
                <input
                  type="password"
                  value={inputPasscode}
                  onChange={(e) => setInputPasscode(e.target.value)}
                  required
                  placeholder="Masukkan NIS kamu..."
                  className="w-full bg-slate-950 border border-sky-500/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-400 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Kunci Akses Admin (081114 - Opsional):</label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Hanya diisi oleh Admin..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="w-1/2 bg-slate-800 text-slate-300 font-mono text-xs py-2 rounded-xl hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingBio}
                  className="w-1/2 bg-sky-400 text-slate-950 font-bold font-mono text-xs py-2 rounded-xl hover:bg-sky-300 disabled:opacity-50"
                >
                  {isSavingBio ? 'Menyimpan...' : 'Simpan Bio ✨'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- GALERI 1: GALERI KEGIATAN KELAS ---------------- */}
      <section id="galeri-kegiatan" className="reveal-item max-w-4xl mx-auto px-6 py-10 border-t border-sky-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xs font-mono text-sky-400 uppercase tracking-widest">Arsip Resmi Kelas</h2>
            <h3 className="text-2xl font-bold text-white tracking-tight mt-1">📁 Galeri Kegiatan Kelas</h3>
          </div>

          <button
            onClick={() => setIsActivityModalOpen(true)}
            className="bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-400/25"
          >
            ➕ Tambah Dokumentasi Kegiatan
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-sky-500/20 rounded-3xl bg-slate-900/40 text-slate-400 text-xs font-mono space-y-2">
            <p className="text-base">Belum ada dokumentasi kegiatan kelas</p>
            <p className="text-[11px] text-slate-500">Klik tombol "Tambah Dokumentasi Kegiatan" di atas untuk mengunggah foto acara resmi kelas!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {activities.map((act) => (
              <div 
                key={act._id} 
                onClick={() => setActivePhotoModal({ imageUrl: act.imageUrl, title: act.title, description: act.description })}
                className="group bg-slate-900 border border-sky-500/20 rounded-2xl overflow-hidden shadow-lg hover:border-sky-400 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img src={act.imageUrl} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => handleDeleteActivity(act._id, e)}
                        className="bg-red-500/80 hover:bg-red-600 text-white text-[10px] font-mono px-2.5 py-1 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        🗑 Hapus (Admin)
                      </button>
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h4 className="text-sm font-bold text-white">{act.title}</h4>
                    {act.description && (
                      <p className="text-xs text-slate-300 font-light leading-relaxed">{act.description}</p>
                    )}
                  </div>
                </div>
                <div className="px-4 pb-4 pt-1 text-[10px] font-mono text-sky-400/80">
                  📅 {new Date(act.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal Upload Galeri Kegiatan */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/30 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono">Tambah Arsip Kegiatan Kelas</h3>
              <button onClick={() => setIsActivityModalOpen(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>

            <form onSubmit={handleUploadActivitySubmit} className="space-y-3">
              {!actFile ? (
                <div className="border-2 border-dashed border-sky-500/30 rounded-2xl p-6 text-center space-y-3 bg-slate-950/50">
                  <p className="text-xs text-slate-300">Pilih foto dokumentasi acara/kegiatan resmi kelas.</p>
                  <label className="inline-block bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl cursor-pointer transition-all shadow-md">
                    📁 Pilih Foto Kegiatan
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setActFile(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-sky-500/30">
                    <img src={actFile} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setActFile(null)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-xl font-mono"
                  >
                    Ganti Foto Lain
                  </button>
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono text-sky-300 block mb-1">Judul Kegiatan:</label>
                <input
                  type="text"
                  placeholder="Misal: Perayaan Hari Guru, Studi Tur, dll..."
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-sky-300 block mb-1">Deskripsi Singkat (Opsional):</label>
                <textarea
                  placeholder="Ceritakan sedikit tentang kegiatan ini..."
                  value={actDescription}
                  onChange={(e) => setActDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="w-1/2 bg-slate-800 text-slate-300 font-mono text-xs py-2 rounded-xl hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploadingAct || !actFile}
                  className="w-1/2 bg-sky-400 text-slate-950 font-bold font-mono text-xs py-2 rounded-xl hover:bg-sky-300 disabled:opacity-50"
                >
                  {isUploadingAct ? 'Mengunggah...' : '🚀 Simpan Kegiatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- GALERI 2: DAILY RANDOM FEED ---------------- */}
      <section id="galeri-daily" className="reveal-item max-w-4xl mx-auto px-6 py-10 border-t border-sky-500/20">
        <div className="mb-6">
          <h2 className="text-xs font-mono text-sky-400 uppercase tracking-widest">Dokumentasi Harian</h2>
          <h3 className="text-2xl font-bold text-white tracking-tight mt-1">Daily Random Feed 📸</h3>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-sky-500/20 rounded-3xl bg-slate-900/40 text-slate-400 text-xs font-mono space-y-2">
            <p className="text-base"> Belum ada foto harian terbaru</p>
            <p className="text-[11px] text-slate-500">Klik tombol kamera mengapung di pojok kanan bawah untuk mengunggah momen pertama kalian!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div 
                key={photo._id} 
                onClick={() => setActivePhotoModal({ imageUrl: photo.imageUrl, caption: photo.caption, author: photo.author })}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-sky-500/20 shadow-md hover:border-sky-400 transition-all cursor-pointer"
              >
                <img src={photo.imageUrl} alt={photo.caption || 'Daily Photo'} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent p-3 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => handleDeletePhoto(photo._id, e)}
                      className="bg-red-500/80 hover:bg-red-600 text-white text-[10px] font-mono px-2 py-1 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      🗑 Hapus (Admin)
                    </button>
                  </div>
                  <div>
                    <p className="text-xs font-normal text-slate-200 line-clamp-1">{photo.caption || 'Random Moment'}</p>
                    <p className="text-[10px] font-mono text-sky-300">By: {photo.author || 'Member'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal Zoom Foto / Lightbox Popup */}
      {activePhotoModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setActivePhotoModal(null)}
        >
          <div className="relative max-w-2xl w-full bg-slate-900 border border-sky-500/30 rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3 cursor-default" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-sky-400">Pratinjau Foto</span>
              <button 
                onClick={() => setActivePhotoModal(null)}
                className="text-slate-400 hover:text-white text-xs font-mono px-3 py-1.5 bg-slate-800 rounded-xl"
              >
                ✕ Tutup
              </button>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-black max-h-[65vh] flex items-center justify-center">
              <img src={activePhotoModal.imageUrl} alt="Zoomed" className="max-h-[60vh] w-auto object-contain rounded-xl" />
            </div>
            {(activePhotoModal.title || activePhotoModal.description || activePhotoModal.caption || activePhotoModal.author) && (
              <div className="text-left space-y-1 pt-1">
                {activePhotoModal.title && <h4 className="text-sm font-bold text-white">{activePhotoModal.title}</h4>}
                {activePhotoModal.description && <p className="text-xs text-slate-300 font-light">{activePhotoModal.description}</p>}
                {activePhotoModal.caption && <p className="text-sm font-medium text-white">{activePhotoModal.caption}</p>}
                {activePhotoModal.author && <p className="text-xs font-mono text-sky-300">Oleh: {activePhotoModal.author}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 6: BOARD PESAN & KESAN */}
      <section id="pesan-kelas" className="reveal-item max-w-4xl mx-auto px-6 py-10 border-t border-sky-500/20">
        <div className="mb-6">
          <h2 className="text-xs font-mono text-sky-400 uppercase tracking-widest">Interaksi Kelas </h2>
          <h3 className="text-2xl font-bold text-white tracking-tight mt-1">Pesan & Kesan 💬</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <form onSubmit={handleSendMessage} className="bg-slate-900/60 border border-sky-500/20 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider font-mono">Tulis Pesan / Curhat</h4>
            <input
              type="text"
              placeholder="Nama kamu (kosongkan untuk Anonim)..."
              value={newSender}
              onChange={(e) => setNewSender(e.target.value)}
              className="w-full bg-slate-950 border border-sky-500/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-400"
            />
            <textarea
              placeholder="Tulis pesan atau kesan singkat..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              required
              className="w-full bg-slate-950 border border-sky-500/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-400 resize-none"
            />
            <button
              type="submit"
              disabled={isSubmittingMessage}
              className="w-full bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              {isSubmittingMessage ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
          </form>

          <div className="md:col-span-2 space-y-3 max-h-72 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 font-mono">
                Belum ada pesan tersimpan. Jadi yang pertama mengirim pesan!
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={msg._id || idx} className="bg-slate-900/80 border border-sky-500/20 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-sky-300 font-bold">@{msg.sender}</span>
                    <span className="text-slate-500">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('id-ID') : 'Baru saja'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200">{msg.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <UploadModal onSuccess={fetchPhotos} />
      <InstallPWA />
      <PushNotificationManager />
    </div>
  );
}