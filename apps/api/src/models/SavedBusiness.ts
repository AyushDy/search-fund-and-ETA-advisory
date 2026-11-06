import { Schema, model, type Document, type Types } from 'mongoose';

export interface SavedBusinessDocument extends Document {
  investorId: Types.ObjectId;
  listingId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const savedBusinessSchema = new Schema<SavedBusinessDocument>({
  investorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: Schema.Types.ObjectId, ref: 'BusinessListing', required: true }
}, { timestamps: true, versionKey: false });

savedBusinessSchema.index({ investorId: 1, listingId: 1 }, { unique: true });
savedBusinessSchema.index({ investorId: 1, createdAt: -1 });

export const SavedBusiness = model<SavedBusinessDocument>('SavedBusiness', savedBusinessSchema);