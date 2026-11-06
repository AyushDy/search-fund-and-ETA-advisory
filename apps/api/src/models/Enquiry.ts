import { Schema, model, type Document, type Types } from 'mongoose';

export const enquiryStatuses = ['NEW', 'IN_REVIEW', 'CONTACTED', 'QUALIFIED', 'DECLINED', 'CLOSED'] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];
export const contactDecisions = ['PENDING', 'CONTACT_NOW', 'DO_NOT_CONTACT', 'CONTACTED'] as const;
export type ContactDecision = (typeof contactDecisions)[number];

export interface EnquiryDocument extends Document {
  investorId: Types.ObjectId;
  listingId: Types.ObjectId;
  status: EnquiryStatus;
  message?: string;
  budget?: number;
  experience?: string;
  reason?: string;
  assignedTo?: Types.ObjectId;
  internalNote?: string;
  contactDecision: ContactDecision;
  followUpAt?: Date;
  followUpNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<EnquiryDocument>({
  investorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  listingId: { type: Schema.Types.ObjectId, ref: 'BusinessListing', required: true, index: true },
  status: { type: String, enum: enquiryStatuses, default: 'NEW', index: true },
  message: { type: String, trim: true, maxlength: 5000 },
  budget: { type: Number, min: 0 },
  experience: { type: String, trim: true, maxlength: 3000 },
  reason: { type: String, trim: true, maxlength: 2000 },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  internalNote: { type: String, trim: true, maxlength: 5000 },
  contactDecision: { type: String, enum: contactDecisions, default: 'PENDING' },
  followUpAt: Date,
  followUpNote: { type: String, trim: true, maxlength: 3000 }
}, { timestamps: true, versionKey: false });

enquirySchema.index({ investorId: 1, listingId: 1, status: 1 });
enquirySchema.index({ status: 1, assignedTo: 1, updatedAt: -1 });
enquirySchema.index({ investorId: 1, listingId: 1 }, { unique: true, partialFilterExpression: { status: { $in: ['NEW', 'IN_REVIEW', 'CONTACTED', 'QUALIFIED'] } } });

export const Enquiry = model<EnquiryDocument>('Enquiry', enquirySchema);