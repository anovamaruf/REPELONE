// src/app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'XII RPL ONE - Techcrafters',
    short_name: 'Techcrafters',
    description: 'Official Web & Memories Portal XII RPL ONE',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    icons: [
      {
        src: '/ikon kelas.PNG',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/ikon kelas.PNG',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}