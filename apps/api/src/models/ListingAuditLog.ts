import { Schema, model, type Document, type Types } from 'mongoose';

export interface ListingAuditLogDocument extends Document {
  listingId: Types.ObjectId;
  actorId: Types.ObjectId;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  reason?: string;
  createdAt: Date;
}

const auditSchema = new Schema<ListingAuditLogDocument>({
  listingId: { type: Schema.Types.ObjectId, ref: 'BusinessListing', required: true, index: true },
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true, maxlength: 80 },
  previousStatus: String,
  newStatus: String,
  reason: { type: String, maxlength: 2000 }
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });

export const ListingAuditLog = model<ListingAuditLogDocument>('ListingAuditLog', auditSchema);
