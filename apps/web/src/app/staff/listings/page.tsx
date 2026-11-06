'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Protected } from '@/components/Protected';
import { ErrorState, LoadingState, EmptyState } from '@/components/States';
import { api } from '@/lib/api';
import type { BusinessListing } from '@/types';

function Listings() { const [listings, setListings] = useState<BusinessListing[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); useEffect(() => { api.listings().then((result) => setListings(result.listings)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load listings')).finally(() => setLoading(false)); }, []); return <main><section className="detail-header"><span className="eyebrow">Internal workspace</span><h1>Business listings</h1><p className="muted">Manage sourced businesses and their approval status.</p><div className="button-row"><Link className="button" href="/staff/listings/new">Create new listing</Link></div></section>{loading ? <LoadingState /> : error ? <ErrorState message={error} /> : listings.length ? <div className="form-stack">{listings.map((listing) => <article className="panel" key={listing.id}><div className="card-top"><div><span className="eyebrow">{listing.industry}</span><h3>{listing.publicTitle}</h3></div><strong>{listing.status}</strong></div><p className="muted">{listing.shortSummary}</p><Link className="text-link" href={`/businesses/${listing.id}`}>Open listing</Link></article>)}</div> : <EmptyState title="No listings yet" message="Create a draft to begin the internal workflow." />}</main>; }
export default function StaffListingsPage() { return <Protected roles={['STAFF', 'APPROVER', 'ADMIN']}><Listings /></Protected>; }
