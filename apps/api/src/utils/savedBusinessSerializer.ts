import type { BusinessListingDocument } from '../models/BusinessListing';
import type { SavedBusinessDocument } from '../models/SavedBusiness';
import { toPublicListing } from './listingSerializer';

export function toInvestorSavedBusiness(savedBusiness: SavedBusinessDocument, listing: BusinessListingDocument) {
  return {
    id: String(savedBusiness._id),
    savedAt: savedBusiness.createdAt,
    listing: toPublicListing(listing)
  };
}