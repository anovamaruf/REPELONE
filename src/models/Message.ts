import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
  sender: { type: String, default: 'Anonim' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Message || model('Message', MessageSchema);