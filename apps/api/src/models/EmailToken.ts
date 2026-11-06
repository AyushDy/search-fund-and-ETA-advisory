import { Schema, model, type Document, type Types } from 'mongoose';

export type EmailTokenType = 'VERIFY_EMAIL' | 'RESET_PASSWORD';
export interface EmailTokenDocument extends Document { userId: Types.ObjectId; type: EmailTokenType; tokenHash: string; expiresAt: Date; usedAt?: Date; createdAt: Date; }

const emailTokenSchema = new Schema<EmailTokenDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['VERIFY_EMAIL', 'RESET_PASSWORD'], required: true },
  tokenHash: { type: String, required: true, unique: true, select: false },
  expiresAt: { type: Date, required: true },
  usedAt: Date
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });
emailTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
emailTokenSchema.index({ userId: 1, type: 1, usedAt: 1 });
export const EmailToken = model<EmailTokenDocument>('EmailToken', emailTokenSchema);
