import mongoose, { Schema, model, models } from 'mongoose';

export interface IGallery {
  imageUrl: string;
  publicId: string;
  caption?: string;
  author?: string;
  category: 'permanent' | 'daily';
  createdAt: Date;
}

const GallerySchema = new Schema<IGallery>({
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  caption: { type: String, default: '' },
  author: { type: String, default: 'Teman Kelas' },
  category: { type: String, default: 'daily' },
  createdAt: { type: Date, default: Date.now },
});

export default models.Gallery || model<IGallery>('Gallery', GallerySchema);