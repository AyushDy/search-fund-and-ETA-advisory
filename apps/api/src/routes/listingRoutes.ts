import { Router } from 'express';
import { Types, type SortOrder } from 'mongoose';
import { requireAuth, requireRoles } from '../middleware/auth';
import { BusinessListing } from '../models/BusinessListing';
import { ListingAuditLog } from '../models/ListingAuditLog';
import { SavedBusiness } from '../models/SavedBusiness';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/errors';
import { toInternalListing, toPublicListing } from '../utils/listingSerializer';
import { toInvestorSavedBusiness } from '../utils/savedBusinessSerializer';
import { sendSuccess } from '../utils/response';
import { directoryQuerySchema, listingSchema, listingUpdateSchema, rejectionSchema } from '../validators/listing';

const router = Router();
const internalRoles = ['STAFF', 'APPROVER', 'ADMIN'] as const;
const approverRoles = ['APPROVER', 'ADMIN'] as const;
function id(value: string) { if (!Types.ObjectId.isValid(value)) throw new AppError(400, 'Invalid listing ID', 'INVALID_ID'); return new Types.ObjectId(value); }
function param(value: string | string[]): string { return Array.isArray(value) ? value[0] : value; }
async function getListing(value: string) { const listing = await BusinessListing.findById(id(value)); if (!listing) throw new AppError(404, 'Listing not found', 'NOT_FOUND'); return listing; }
async function audit(listingId: Types.ObjectId, actorId: string, action: string, previousStatus?: string, newStatus?: string, reason?: string) { await ListingAuditLog.create({ listingId, actorId: new Types.ObjectId(actorId), action, previousStatus, newStatus, reason }); }

router.post('/listings', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => {
  const input = listingSchema.parse(request.body);
  const listing = await BusinessListing.create({ ...input, createdBy: request.user!.id, updatedBy: request.user!.id, status: 'DRAFT' });
  await audit(listing._id, request.user!.id, 'CREATED', undefined, 'DRAFT');
  sendSuccess(response, { listing: toInternalListing(listing) }, 'Draft listing created', 201);
}));

router.get('/listings', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => {
  const query = request.query as { status?: string; industry?: string; creatorId?: string; page?: string; pageSize?: string };
  const page = Math.max(1, Number(query.page ?? 1)); const pageSize = Math.min(50, Math.max(1, Number(query.pageSize ?? 20)));
  const filter: Record<string, unknown> = {}; if (query.status) filter.status = query.status; if (query.industry) filter.industry = query.industry; if (query.creatorId && Types.ObjectId.isValid(query.creatorId)) filter.createdBy = query.creatorId;
  const [listings, total] = await Promise.all([BusinessListing.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * pageSize).limit(pageSize), BusinessListing.countDocuments(filter)]);
  sendSuccess(response, { listings: listings.map(toInternalListing), pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
}));

router.get('/listings/:listingId', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => { sendSuccess(response, { listing: toInternalListing(await getListing(param(request.params.listingId))) }); }));
router.patch('/listings/:listingId', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => {
  const listing = await getListing(param(request.params.listingId)); const previousStatus = listing.status; const input = listingUpdateSchema.parse(request.body);
  if (listing.status === 'APPROVED') listing.status = 'UNDER_REVIEW';
  Object.assign(listing, input, { updatedBy: request.user!.id }); await listing.save();
  await audit(listing._id, request.user!.id, previousStatus === 'APPROVED' ? 'RETURNED_TO_REVIEW' : 'UPDATED', previousStatus, listing.status);
  sendSuccess(response, { listing: toInternalListing(listing) }, 'Listing updated');
}));
router.post('/listings/:listingId/submit-for-review', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => {
  const listing = await getListing(param(request.params.listingId)); if (!['DRAFT', 'REJECTED'].includes(listing.status)) throw new AppError(409, 'Only draft or rejected listings can be submitted', 'INVALID_TRANSITION');
  const previous = listing.status; listing.status = 'UNDER_REVIEW'; listing.submittedAt = new Date(); listing.submittedBy = new Types.ObjectId(request.user!.id); listing.updatedBy = new Types.ObjectId(request.user!.id); await listing.save(); await audit(listing._id, request.user!.id, 'SUBMITTED_FOR_REVIEW', previous, 'UNDER_REVIEW'); sendSuccess(response, { listing: toInternalListing(listing) }, 'Listing submitted for review');
}));
router.post('/listings/:listingId/approve', requireAuth, requireRoles(...approverRoles), asyncHandler(async (request, response) => {
  const listing = await getListing(param(request.params.listingId)); if (listing.status !== 'UNDER_REVIEW') throw new AppError(409, 'Only listings under review can be approved', 'INVALID_TRANSITION'); if (String(listing.createdBy) === request.user!.id && request.user!.role !== 'ADMIN') throw new AppError(403, 'A staff member cannot approve their own listing', 'SEPARATION_OF_DUTIES');
  listing.status = 'APPROVED'; listing.reviewedBy = new Types.ObjectId(request.user!.id); listing.reviewedAt = new Date(); listing.updatedBy = new Types.ObjectId(request.user!.id); listing.rejectionReason = undefined; await listing.save(); await audit(listing._id, request.user!.id, 'APPROVED', 'UNDER_REVIEW', 'APPROVED'); sendSuccess(response, { listing: toInternalListing(listing) }, 'Listing approved');
}));
router.post('/listings/:listingId/reject', requireAuth, requireRoles(...approverRoles), asyncHandler(async (request, response) => {
  const listing = await getListing(param(request.params.listingId)); if (listing.status !== 'UNDER_REVIEW') throw new AppError(409, 'Only listings under review can be rejected', 'INVALID_TRANSITION'); const { reason } = rejectionSchema.parse(request.body); listing.status = 'REJECTED'; listing.rejectionReason = reason; listing.reviewedBy = new Types.ObjectId(request.user!.id); listing.reviewedAt = new Date(); listing.updatedBy = new Types.ObjectId(request.user!.id); await listing.save(); await audit(listing._id, request.user!.id, 'REJECTED', 'UNDER_REVIEW', 'REJECTED', reason); sendSuccess(response, { listing: toInternalListing(listing) }, 'Listing rejected');
}));
router.post('/listings/:listingId/archive', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => { const listing = await getListing(param(request.params.listingId)); if (listing.status === 'ARCHIVED') throw new AppError(409, 'Listing is already archived', 'INVALID_TRANSITION'); const previous = listing.status; listing.status = 'ARCHIVED'; listing.updatedBy = new Types.ObjectId(request.user!.id); await listing.save(); await audit(listing._id, request.user!.id, 'ARCHIVED', previous, 'ARCHIVED'); sendSuccess(response, { listing: toInternalListing(listing) }, 'Listing archived'); }));
router.get('/listings/:listingId/audit', requireAuth, requireRoles(...internalRoles), asyncHandler(async (request, response) => { const listing = await getListing(param(request.params.listingId)); const logs = await ListingAuditLog.find({ listingId: listing._id }).sort({ createdAt: 1 }); sendSuccess(response, { audit: logs }); }));

router.get('/businesses', requireAuth, asyncHandler(async (request, response) => {
  const query = directoryQuerySchema.parse(request.query); if (query.minRevenue !== undefined && query.maxRevenue !== undefined && query.minRevenue > query.maxRevenue) throw new AppError(400, 'Minimum revenue cannot exceed maximum revenue', 'INVALID_RANGE');
  const filter: Record<string, unknown> = { status: 'APPROVED' }; for (const [key, value] of Object.entries({ industry: query.industry, country: query.country, region: query.region, city: query.city })) if (value) filter[key] = value;
  if (query.search) filter.$text = { $search: query.search }; if (query.minRevenue !== undefined || query.maxRevenue !== undefined) filter['revenue.amount'] = { ...(query.minRevenue !== undefined ? { $gte: query.minRevenue } : {}), ...(query.maxRevenue !== undefined ? { $lte: query.maxRevenue } : {}) }; if (query.minAskingPrice !== undefined || query.maxAskingPrice !== undefined) filter['askingPrice.amount'] = { ...(query.minAskingPrice !== undefined ? { $gte: query.minAskingPrice } : {}), ...(query.maxAskingPrice !== undefined ? { $lte: query.maxAskingPrice } : {}) };
  const sort: Record<string, SortOrder> = query.sort === 'revenue_desc' ? { 'revenue.amount': -1 } : query.sort === 'asking_asc' ? { 'askingPrice.amount': 1 } : { createdAt: -1 }; const [listings, total] = await Promise.all([BusinessListing.find(filter).sort(sort).skip((query.page - 1) * query.pageSize).limit(query.pageSize), BusinessListing.countDocuments(filter)]);
  sendSuccess(response, { listings: listings.map(toPublicListing), pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) } });
}));
router.get('/businesses/:listingId', requireAuth, asyncHandler(async (request, response) => { const listing = await BusinessListing.findOne({ _id: id(param(request.params.listingId)), status: 'APPROVED' }); if (!listing) throw new AppError(404, 'Business opportunity not found', 'NOT_FOUND'); sendSuccess(response, { listing: toPublicListing(listing) }); }));

router.get('/saved-businesses', requireAuth, requireRoles('INVESTOR'), asyncHandler(async (request, response) => {
  const savedBusinesses = await SavedBusiness.find({ investorId: request.user!.id }).sort({ createdAt: -1 });
  const listings = await BusinessListing.find({ _id: { $in: savedBusinesses.map((saved) => saved.listingId) }, status: 'APPROVED' });
  const listingById = new Map(listings.map((listing) => [String(listing._id), listing]));
  sendSuccess(response, { savedBusinesses: savedBusinesses.flatMap((saved) => { const listing = listingById.get(String(saved.listingId)); return listing ? [toInvestorSavedBusiness(saved, listing)] : []; }) });
}));

router.post('/saved-businesses', requireAuth, requireRoles('INVESTOR'), asyncHandler(async (request, response) => {
  const listingId = id(String(request.body?.listingId ?? ''));
  const listing = await BusinessListing.findOne({ _id: listingId, status: 'APPROVED' });
  if (!listing) throw new AppError(404, 'Business opportunity not found', 'NOT_FOUND');
  try {
    const savedBusiness = await SavedBusiness.create({ investorId: request.user!.id, listingId });
    sendSuccess(response, { savedBusiness: toInvestorSavedBusiness(savedBusiness, listing) }, 'Business saved', 201);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) throw new AppError(409, 'Business is already saved', 'ALREADY_SAVED');
    throw error;
  }
}));

router.delete('/saved-businesses/:listingId', requireAuth, requireRoles('INVESTOR'), asyncHandler(async (request, response) => {
  const deleted = await SavedBusiness.findOneAndDelete({ investorId: request.user!.id, listingId: id(param(request.params.listingId)) });
  if (!deleted) throw new AppError(404, 'Saved business not found', 'NOT_FOUND');
  sendSuccess(response, { listingId: param(request.params.listingId) }, 'Business removed from saved businesses');
}));

export default router;
