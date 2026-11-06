'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Protected } from '@/components/Protected';
import { ErrorState, LoadingState, EmptyState } from '@/components/States';
import { api } from '@/lib/api';
import type { BusinessListing } from '@/types';

function ReviewQueue() { const [listings, setListings] = useState<BusinessListing[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); useEffect(() => { api.listings('?status=UNDER_REVIEW').then((result) => setListings(result.listings)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load the review queue')).finally(() => setLoading(false)); }, []); return <main><section className="detail-header"><span className="eyebrow">Approver workspace</span><h1>Review queue</h1><p className="muted">Review business listings before they become available to investors.</p></section>{loading ? <LoadingState /> : error ? <ErrorState message={error} /> : listings.length ? <div className="form-stack">{listings.map((listing) => <article className="panel" key={listing.id}><span className="eyebrow">{listing.industry}</span><h3>{listing.publicTitle}</h3><p className="muted">{listing.shortSummary}</p><Link className="text-link" href={`/staff/listings/${listing.id}`}>Open review</Link></article>)}</div> : <EmptyState title="No listings are currently awaiting review" message="New submissions will appear here after staff send them for review." />}</main>; }
export default function ReviewPage() { return <Protected roles={['APPROVER', 'ADMIN']}><ReviewQueue /></Protected>; }
