import { z } from 'zod';

export const createEnquirySchema = z.object({
  listingId: z.string().min(1),
  message: z.string().trim().max(5000).optional(),
  budget: z.number().finite().nonnegative().optional(),
  experience: z.string().trim().max(3000).optional(),
  reason: z.string().trim().max(2000).optional()
}).strict();

export const enquiryStatusSchema = z.object({ status: z.enum(['NEW', 'IN_REVIEW', 'CONTACTED', 'QUALIFIED', 'DECLINED', 'CLOSED']) }).strict();
export const assignmentSchema = z.object({ assignedTo: z.string().min(1).nullable() }).strict();
export const internalNoteSchema = z.object({ internalNote: z.string().trim().max(5000) }).strict();
export const contactDecisionSchema = z.object({ contactDecision: z.enum(['PENDING', 'CONTACT_NOW', 'DO_NOT_CONTACT', 'CONTACTED']) }).strict();
export const followUpSchema = z.object({ followUpAt: z.string().datetime().nullable().optional(), followUpNote: z.string().trim().max(3000).nullable().optional() }).strict();