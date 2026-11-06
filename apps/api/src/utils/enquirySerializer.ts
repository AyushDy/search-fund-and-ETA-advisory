import type { EnquiryDocument } from '../models/Enquiry';
import type { BusinessListingDocument } from '../models/BusinessListing';
import { toPublicListing } from './listingSerializer';

function listingValue(enquiry: EnquiryDocument) { return enquiry.populated('listingId') as BusinessListingDocument | undefined; }

export function toInvestorEnquiry(enquiry: EnquiryDocument) {
  const listing = listingValue(enquiry);
  return {
    id: String(enquiry._id), listingId: String(enquiry.listingId), status: enquiry.status,
    message: enquiry.message, budget: enquiry.budget, experience: enquiry.experience, reason: enquiry.reason,
    createdAt: enquiry.createdAt, updatedAt: enquiry.updatedAt,
    ...(listing ? { listing: toPublicListing(listing) } : {})
  };
}

export function toInternalEnquiry(enquiry: EnquiryDocument) {
  const listing = listingValue(enquiry);
  const investor = enquiry.populated('investorId') as { _id: unknown; firstName?: string; lastName?: string; email?: string } | undefined;
  const assignedTo = enquiry.populated('assignedTo') as { _id: unknown; firstName?: string; lastName?: string; email?: string } | undefined;
  return {
    id: String(enquiry._id), investorId: String(enquiry.investorId), listingId: String(enquiry.listingId), status: enquiry.status,
    message: enquiry.message, budget: enquiry.budget, experience: enquiry.experience, reason: enquiry.reason,
    assignedTo: assignedTo ? { id: String(assignedTo._id), name: `${assignedTo.firstName ?? ''} ${assignedTo.lastName ?? ''}`.trim(), email: assignedTo.email } : enquiry.assignedTo ? { id: String(enquiry.assignedTo) } : null,
    investor: investor ? { id: String(investor._id), name: `${investor.firstName ?? ''} ${investor.lastName ?? ''}`.trim(), email: investor.email } : { id: String(enquiry.investorId) },
    internalNote: enquiry.internalNote, contactDecision: enquiry.contactDecision, followUpAt: enquiry.followUpAt, followUpNote: enquiry.followUpNote,
    createdAt: enquiry.createdAt, updatedAt: enquiry.updatedAt, ...(listing ? { listing: toPublicListing(listing) } : {})
  };
}