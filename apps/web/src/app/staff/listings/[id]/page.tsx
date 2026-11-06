'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Protected } from '@/components/Protected';
import { ErrorState, LoadingState } from '@/components/States';
import { api } from '@/lib/api';
import type { BusinessListing } from '@/types';

function ListingDetail() { const { id } = useParams<{ id: string }>(); const [listing, setListing] = useState<BusinessListing | null>(null); const [error, setError] = useState(''); useEffect(() => { api.listing(id).then((result) => setListing(result.listing)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load listing')); }, [id]); if (error) return <main><ErrorState message={error} /></main>; if (!listing) return <main><LoadingState /></main>; return <main><Link className="text-link" href="/staff/listings">&lt;- Back to listings</Link><section className="detail-header"><span className="eyebrow">Internal listing · {listing.status}</span><h1>{listing.publicTitle}</h1><p className="muted">{listing.shortSummary}</p></section><div className="detail-layout"><div className="form-stack"><section className="panel"><h2>Business overview</h2><p>{listing.description || 'No detailed description provided.'}</p><p>Industry: {listing.industry}</p><p>Identity mode: {listing.identityMode}</p></section><section className="panel"><h2>Financial information</h2><p>Revenue: {listing.revenue ? `${listing.revenue.currency} ${listing.revenue.amount.toLocaleString()}` : 'Not provided'}</p><p>Asking price: {listing.askingPrice ? `${listing.askingPrice.currency} ${listing.askingPrice.amount.toLocaleString()}` : 'Not provided'}</p></section></div><aside className="panel"><h2>Internal information</h2><p className="muted">This area is restricted to authorized internal users.</p>{listing.internalNotes && <p>{listing.internalNotes}</p>}</aside></div></main>; }
export default function StaffListingDetailPage() { return <Protected roles={['STAFF', 'APPROVER', 'ADMIN']}><ListingDetail /></Protected>; }
