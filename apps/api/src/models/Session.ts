import { Schema, model, type Document, type Types } from 'mongoose';

export interface SessionDocument extends Document {
  userId: Types.ObjectId;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
}

const sessionSchema = new Schema<SessionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  refreshTokenHash: { type: String, required: true, unique: true, select: false },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date }
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const Session = model<SessionDocument>('Session', sessionSchema);
