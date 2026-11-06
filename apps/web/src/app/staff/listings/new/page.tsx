'use client';

import { Protected } from '@/components/Protected';
import { ListingForm } from '@/components/ListingForm';
function NewListing() { return <main><section className="detail-header"><span className="eyebrow">Business listings</span><h1>Create a new listing</h1><p className="muted">Record the available information without filling unknown financial values with zero.</p></section><ListingForm /></main>; }
export default function NewListingPage() { return <Protected roles={['STAFF', 'APPROVER', 'ADMIN']}><NewListing /></Protected>; }
