import type { BusinessListingDocument } from '../models/BusinessListing';

function financial(value?: { amount: number; currency: string; period?: string }) {
  return value ? { amount: value.amount, currency: value.currency, ...(value.period ? { period: value.period } : {}) } : undefined;
}

export function toPublicListing(listing: BusinessListingDocument) {
  const base = { id: String(listing._id), publicTitle: listing.publicTitle, shortSummary: listing.shortSummary, description: listing.description, industry: listing.industry, subIndustry: listing.subIndustry, country: listing.country, region: listing.region, city: listing.city, productsAndServices: listing.productsAndServices, yearsOperating: listing.yearsOperating, employeeRange: listing.employeeRange, revenue: financial(listing.revenue), ebitda: financial(listing.ebitda), sde: financial(listing.sde), askingPrice: financial(listing.askingPrice), identityMode: listing.identityMode };
  if (listing.identityMode === 'IDENTIFIED') return { ...base, legalBusinessName: listing.legalBusinessName, publicWebsite: listing.publicWebsite };
  return base;
}

export function toInternalListing(listing: BusinessListingDocument) {
  return { ...listing.toObject(), id: String(listing._id), createdBy: String(listing.createdBy), updatedBy: String(listing.updatedBy), submittedBy: listing.submittedBy ? String(listing.submittedBy) : undefined, reviewedBy: listing.reviewedBy ? String(listing.reviewedBy) : undefined };
}
