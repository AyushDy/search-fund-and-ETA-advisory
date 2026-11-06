import { Router } from 'express';
import { Types } from 'mongoose';
import { requireAuth, requireRoles } from '../middleware/auth';
import { Enquiry, type EnquiryDocument, type EnquiryStatus } from '../models/Enquiry';
import { BusinessListing } from '../models/BusinessListing';
import { User } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errors';
import { sendSuccess } from '../utils/response';
import { toInternalEnquiry, toInvestorEnquiry } from '../utils/enquirySerializer';
import { assignmentSchema, contactDecisionSchema, createEnquirySchema, enquiryStatusSchema, followUpSchema, internalNoteSchema } from '../validators/enquiry';

const router = Router();
const internalRoles = ['STAFF', 'APPROVER', 'ADMIN'] as const;
const assignmentRoles = ['APPROVER', 'ADMIN'] as const;
const transitions: Record<EnquiryStatus, EnquiryStatus[]> = { NEW: ['IN_REVIEW', 'DECLINED'], IN_REVIEW: ['CONTACTED', 'DECLINED'], CONTACTED: ['QUALIFIED', 'DECLINED', 'CLOSED'], QUALIFIED: ['CLOSED'], DECLINED: ['IN_REVIEW'], CLOSED: [] };
function objectId(value: string, label: string) { if (!Types.ObjectId.isValid(value)) throw new AppError(400, `Invalid ${label}`, 'INVALID_ID'); return new Types.ObjectId(value); }
async function getEnquiry(value: string | string[]) { const id = Array.isArray(value) ? value[0] : value; const enquiry = await Enquiry.findById(objectId(id, 'enquiry ID')).populate('listingId').populate('investorId', 'firstName lastName email').populate('assignedTo', 'firstName lastName email'); if (!enquiry) throw new AppError(404, 'Enquiry not found', 'NOT_FOUND'); return enquiry; }

router.post('/enquiries', requireAuth, requireRoles('INVESTOR'), asyncHandler(async (request, response) => {
  const input = createEnquirySchema.parse(request.body);
  const listing = await BusinessListing.findOne({ _id: objectId(input.listingId, 'listing ID'), status: 'APPROVED' });
  if (!listing) throw new AppError(404, 'Business opportunity not found', 'NOT_FOUND');
  const active = await Enquiry.findOne({ investorId: request.user!.id, listingId: listing._id, status: { $in: ['NEW', 'IN_REVIEW', 'CONTACTED', 'QUALIFIED'] } });
  if (active) throw new AppError(409, 'You already have an active enquiry for this business', 'ACTIVE_ENQUIRY_EXISTS');
  try {
    const enquiry = await Enquiry.create({ ...input, listingId: listing._id, investorId: request.user!.id });
    await enquiry.populate('listingId');
    sendSuccess(response, { enquiry: toInvestorEnquiry(enquiry) }, 'Enquiry submitted', 201);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) throw new AppError(409, 'You already have an active enquiry for this business', 'ACTIVE_ENQUIRY_EXISTS');
    throw error;
  }
}));

router.get('/enquiries', requireAuth, requireRoles('INVESTOR'), asyncHandler(async (request, response) => {
  const enquiries = await Enquiry.find({ investorId: request.user!.id }).sort({ createdAt: -1 }).populate('listingId');
  sendSuccess(response, { enquiries: enquiries.map(toInvestorEnquiry) });
}));

router.get('/internal/enquiries', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => {
  const status = typeof request.query.status === 'string' ? request.query.status : undefined;
  const filter: Record<string, unknown> = status ? { status } : {};
  const enquiries = await Enquiry.find(filter).sort({ updatedAt: -1 }).populate('listingId').populate('investorId', 'firstName lastName email').populate('assignedTo', 'firstName lastName email');
  sendSuccess(response, { enquiries: enquiries.map((enquiry) => toInternalEnquiry(enquiry as unknown as EnquiryDocument)) });
}));
router.get('/internal/enquiries/:enquiryId', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => { sendSuccess(response, { enquiry: toInternalEnquiry(await getEnquiry(request.params.enquiryId)) }); }));
router.patch('/internal/enquiries/:enquiryId/status', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => { const enquiry = await getEnquiry(request.params.enquiryId); const { status } = enquiryStatusSchema.parse(request.body); if (status !== enquiry.status && !transitions[enquiry.status].includes(status)) throw new AppError(409, `Cannot move enquiry from ${enquiry.status} to ${status}`, 'INVALID_TRANSITION'); enquiry.status = status; await enquiry.save(); sendSuccess(response, { enquiry: toInternalEnquiry(enquiry) }, 'Enquiry status updated'); }));
router.patch('/internal/enquiries/:enquiryId/assignment', requireAuth, requireRoles(...assignmentRoles), asyncHandler(async (request, response) => { const enquiry = await getEnquiry(request.params.enquiryId); const { assignedTo } = assignmentSchema.parse(request.body); if (assignedTo) { const assignee = await User.findOne({ _id: objectId(assignedTo, 'assignee ID'), role: { $in: internalRoles }, status: 'ACTIVE' }); if (!assignee) throw new AppError(400, 'Assignee must be an active internal account', 'INVALID_ASSIGNEE'); enquiry.assignedTo = assignee._id; } else enquiry.assignedTo = undefined; await enquiry.save(); await enquiry.populate('assignedTo', 'firstName lastName email'); sendSuccess(response, { enquiry: toInternalEnquiry(enquiry) }, 'Enquiry assignment updated'); }));
router.patch('/internal/enquiries/:enquiryId/internal-note', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => { const enquiry = await getEnquiry(request.params.enquiryId); Object.assign(enquiry, internalNoteSchema.parse(request.body)); await enquiry.save(); sendSuccess(response, { enquiry: toInternalEnquiry(enquiry) }, 'Internal note updated'); }));
router.patch('/internal/enquiries/:enquiryId/contact-decision', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => { const enquiry = await getEnquiry(request.params.enquiryId); Object.assign(enquiry, contactDecisionSchema.parse(request.body)); await enquiry.save(); sendSuccess(response, { enquiry: toInternalEnquiry(enquiry) }, 'Contact decision updated'); }));
router.patch('/internal/enquiries/:enquiryId/follow-up', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => { const enquiry = await getEnquiry(request.params.enquiryId); const input = followUpSchema.parse(request.body); if (input.followUpAt !== undefined) enquiry.followUpAt = input.followUpAt ? new Date(input.followUpAt) : undefined; if (input.followUpNote !== undefined) enquiry.followUpNote = input.followUpNote ?? undefined; await enquiry.save(); sendSuccess(response, { enquiry: toInternalEnquiry(enquiry) }, 'Follow-up updated'); }));

export { transitions };
export default router;