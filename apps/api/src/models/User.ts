import { Schema, model, type Document } from 'mongoose';
import type { AccountStatus, Role } from '../types/auth';

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  notificationPreferences: { email: boolean; inApp: boolean };
  passwordHash: string;
  role: Role;
  status: AccountStatus;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>({
  firstName: { type: String, required: true, trim: true, maxlength: 80 },
  lastName: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, trim: true, maxlength: 32 },
  emailVerified: { type: Boolean, required: true, default: false },
  phoneVerified: { type: Boolean, required: true, default: false },
  notificationPreferences: {
    email: { type: Boolean, required: true, default: true },
    inApp: { type: Boolean, required: true, default: true }
  },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['INVESTOR', 'STAFF', 'APPROVER', 'ADMIN'], required: true, default: 'INVESTOR' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'DISABLED'], required: true, default: 'ACTIVE' },
  lastLoginAt: { type: Date }
}, { timestamps: true, versionKey: false });

export const User = model<UserDocument>('User', userSchema);

export function toSafeUser(user: UserDocument | Record<string, unknown>) {
  return {
    id: String(user._id),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? null,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    notificationPreferences: user.notificationPreferences,
    role: user.role,
    status: user.status
  };
}
