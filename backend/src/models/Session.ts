import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  duration: number; // in minutes
  steps: { title: string; content: string }[];
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled Session' },
    description: { type: String, default: '' },
    category: { type: String, default: 'Uncategorized' },
    duration: { type: Number, default: 0 },
    steps: [
      {
        title: { type: String, default: '' },
        content: { type: String, default: '' },
      },
    ],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
);

export default mongoose.model<ISession>('Session', SessionSchema);
