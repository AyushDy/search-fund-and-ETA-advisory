import { toPublicListing } from '../src/utils/listingSerializer';
import { requireRoles } from '../src/middleware/auth';
import { SavedBusiness } from '../src/models/SavedBusiness';
import { notificationPreferencesSchema, passwordChangeSchema, profileUpdateSchema, registerSchema } from '../src/validators/auth';
import { toSafeUser } from '../src/models/User';
import { Enquiry } from '../src/models/Enquiry';
import { createEnquirySchema } from '../src/validators/enquiry';
import { transitions } from '../src/routes/enquiryRoutes';

describe('public listing serialization', () => {
  const base = { _id: 'listing-1', publicTitle: 'Regional Services Company', shortSummary: 'A focused services opportunity', industry: 'Services', identityMode: 'ANONYMIZED' as const, legalBusinessName: 'Secret Legal Name Ltd', internalWebsite: 'https://internal.example.com', publicWebsite: 'https://secret.example.com', internalNotes: 'Seller prefers a quiet process', revenue: undefined };
  it('removes confidential identity and internal notes for anonymized listings', () => {
    const result = toPublicListing(base as never);
    expect(result).not.toHaveProperty('legalBusinessName');
    expect(result).not.toHaveProperty('publicWebsite');
    expect(result).not.toHaveProperty('internalNotes');
    expect(result.publicTitle).toBe('Regional Services Company');
  });
  it('keeps only approved identity fields for identified listings', () => {
    const result = toPublicListing({ ...base, identityMode: 'IDENTIFIED' } as never);
    expect((result as { legalBusinessName?: string }).legalBusinessName).toBe('Secret Legal Name Ltd');
    expect((result as { publicWebsite?: string }).publicWebsite).toBe('https://secret.example.com');
  });
});

describe('registration validation', () => {
  it('accepts a requested role for the explicitly enabled development mode', () => {
    const result = registerSchema.safeParse({ firstName: 'A', lastName: 'B', email: 'a@example.com', password: 'a sufficiently long password', role: 'ADMIN' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.role).toBe('ADMIN');
  });
  it('rejects short passwords', () => {
    expect(registerSchema.safeParse({ firstName: 'A', lastName: 'B', email: 'a@example.com', password: 'short' }).success).toBe(false);
  });
});

describe('account management validation', () => {
  it('only accepts permitted profile fields and rejects email changes', () => {
    expect(profileUpdateSchema.safeParse({ firstName: 'Updated', phone: '+1 555 0100' }).success).toBe(true);
    expect(profileUpdateSchema.safeParse({ email: 'new@example.com' }).success).toBe(false);
  });
  it('requires a strong, changed password', () => {
    expect(passwordChangeSchema.safeParse({ currentPassword: 'old password', newPassword: 'new sufficiently long password' }).success).toBe(true);
    expect(passwordChangeSchema.safeParse({ currentPassword: 'same password', newPassword: 'same password' }).success).toBe(false);
  });
  it('accepts only known notification preference flags', () => {
    expect(notificationPreferencesSchema.safeParse({ email: false }).success).toBe(true);
    expect(notificationPreferencesSchema.safeParse({ sms: true }).success).toBe(false);
  });
  it('does not expose password hashes or verification controls', () => {
    const user = toSafeUser({ _id: 'user-1', firstName: 'A', lastName: 'B', email: 'a@example.com', phone: undefined, emailVerified: false, phoneVerified: false, notificationPreferences: { email: true, inApp: true }, role: 'INVESTOR', status: 'ACTIVE', passwordHash: 'secret' });
    expect(user).not.toHaveProperty('passwordHash');
    expect(user.emailVerified).toBe(false);
  });
});

describe('saved business authorization', () => {
  it('only allows investors through the saved-business route guard', () => {
    const next = vi.fn();
    requireRoles('INVESTOR')({ user: { id: 'user-1', role: 'STAFF', status: 'ACTIVE', email: 'staff@example.com' } } as never, {} as never, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403, code: 'FORBIDDEN' }));
  });

  it('defines a unique investor/listing constraint for duplicate saves', () => {
    expect(SavedBusiness.schema.indexes()).toContainEqual([{ investorId: 1, listingId: 1 }, { unique: true }]);
  });
});

describe('enquiry authorization and workflow', () => {
  it('requires a listing ID and rejects unknown fields', () => {
    expect(createEnquirySchema.safeParse({ listingId: 'listing-1', unexpected: true }).success).toBe(false);
    expect(createEnquirySchema.safeParse({ listingId: 'listing-1', budget: -1 }).success).toBe(false);
  });
  it('allows only forward workflow transitions plus declined reopening', () => {
    expect(transitions.NEW).toContain('IN_REVIEW');
    expect(transitions.QUALIFIED).toEqual(['CLOSED']);
    expect(transitions.CLOSED).toEqual([]);
    expect(transitions.DECLINED).toContain('IN_REVIEW');
  });
  it('stores the active-enquiry uniqueness rule by investor and listing', () => {
    expect(Enquiry.schema.indexes()).toContainEqual(expect.arrayContaining([{ investorId: 1, listingId: 1 }]));
  });
  it('does not allow staff through investor enquiry guards', () => {
    const next = vi.fn();
    requireRoles('INVESTOR')({ user: { id: 'staff-1', role: 'STAFF', status: 'ACTIVE', email: 'staff@example.com' } } as never, {} as never, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403, code: 'FORBIDDEN' }));
  });
});
