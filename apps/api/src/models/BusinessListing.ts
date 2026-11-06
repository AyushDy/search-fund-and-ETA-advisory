import { Schema, model, type Document, type Types } from 'mongoose';

export const listingStatuses = ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'] as const;
export type ListingStatus = (typeof listingStatuses)[number];
export const identityModes = ['ANONYMIZED', 'IDENTIFIED'] as const;
export type IdentityMode = (typeof identityModes)[number];

export interface FinancialValue {
  amount: number;
  currency: string;
  period?: string;
}

export interface BusinessListingDocument extends Document {
  publicTitle: string;
  legalBusinessName?: string;
  identityMode: IdentityMode;
  internalWebsite?: string;
  publicWebsite?: string;
  shortSummary: string;
  description?: string;
  industry: string;
  subIndustry?: string;
  country?: string;
  region?: string;
  city?: string;
  productsAndServices?: string;
  yearsOperating?: number;
  employeeRange?: string;
  revenue?: FinancialValue;
  ebitda?: FinancialValue;
  sde?: FinancialValue;
  askingPrice?: FinancialValue;
  sellerMotivation?: string;
  internalNotes?: string;
  status: ListingStatus;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  submittedAt?: Date;
  submittedBy?: Types.ObjectId;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const financialSchema = new Schema<FinancialValue>({
  amount: { type: Number, min: 0, required: true },
  currency: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 3 },
  period: { type: String, maxlength: 40 }
}, { _id: false });

const listingSchema = new Schema<BusinessListingDocument>({
  publicTitle: { type: String, required: true, trim: true, maxlength: 160 },
  legalBusinessName: { type: String, trim: true, maxlength: 160 },
  identityMode: { type: String, enum: identityModes, required: true },
  internalWebsite: { type: String, trim: true, maxlength: 300 },
  publicWebsite: { type: String, trim: true, maxlength: 300 },
  shortSummary: { type: String, required: true, trim: true, maxlength: 500 },
  description: { type: String, trim: true, maxlength: 10000 },
  industry: { type: String, required: true, trim: true, maxlength: 100 },
  subIndustry: { type: String, trim: true, maxlength: 100 },
  country: { type: String, trim: true, maxlength: 100 },
  region: { type: String, trim: true, maxlength: 100 },
  city: { type: String, trim: true, maxlength: 100 },
  productsAndServices: { type: String, trim: true, maxlength: 5000 },
  yearsOperating: { type: Number, min: 0, max: 500 },
  employeeRange: { type: String, trim: true, maxlength: 80 },
  revenue: financialSchema,
  ebitda: financialSchema,
  sde: financialSchema,
  askingPrice: financialSchema,
  sellerMotivation: { type: String, trim: true, maxlength: 5000 },
  internalNotes: { type: String, trim: true, maxlength: 10000 },
  status: { type: String, enum: listingStatuses, default: 'DRAFT', index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  submittedAt: Date,
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  rejectionReason: { type: String, trim: true, maxlength: 2000 },
  featured: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });

listingSchema.index({ status: 1, industry: 1, createdAt: -1 });
listingSchema.index({ publicTitle: 'text', shortSummary: 'text', description: 'text', industry: 'text', country: 'text', region: 'text', city: 'text' });
export const BusinessListing = model<BusinessListingDocument>('BusinessListing', listingSchema);
