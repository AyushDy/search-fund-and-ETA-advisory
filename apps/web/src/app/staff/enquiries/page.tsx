'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Protected } from '@/components/Protected';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { api } from '@/lib/api';
import type { Enquiry } from '@/types';

function Inbox() { const [items, setItems] = useState<Enquiry[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); useEffect(() => { api.internalEnquiries().then((result) => setItems(result.enquiries)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load the enquiry inbox')).finally(() => setLoading(false)); }, []); return <main><section className="detail-header"><span className="eyebrow">Internal workspace</span><h1>Enquiry inbox</h1><p className="muted">Review investor interest and coordinate next steps.</p></section>{loading ? <LoadingState /> : error ? <ErrorState message={error} /> : items.length ? <div className="form-stack">{items.map((item) => <article className="panel" key={item.id}><div className="card-top"><div><span className="eyebrow">{item.investor?.name || item.investorId}</span><h2>{item.listing?.publicTitle || item.listingId}</h2></div><strong>{item.status.replace('_', ' ')}</strong></div><p className="muted">{item.investor?.email || 'Investor contact unavailable'}</p><Link className="text-link" href={`/staff/enquiries/${item.id}`}>Open enquiry</Link></article>)}</div> : <EmptyState title="Inbox is clear" message="New investor enquiries will appear here." />}</main>; }
export default function StaffEnquiriesPage() { return <Protected roles={['STAFF', 'APPROVER', 'ADMIN']}><Inbox /></Protected>; }