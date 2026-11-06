'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Protected } from '@/components/Protected';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { api } from '@/lib/api';
import type { Enquiry } from '@/types';

function EnquiriesContent() { const [items, setItems] = useState<Enquiry[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); useEffect(() => { api.enquiries().then((result) => setItems(result.enquiries)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load enquiries')).finally(() => setLoading(false)); }, []); return <main><section className="detail-header"><span className="eyebrow">Investor account</span><h1>My enquiries</h1><p className="muted">Track your interest in approved opportunities.</p></section>{loading ? <LoadingState /> : error ? <ErrorState message={error} /> : items.length ? <div className="form-stack">{items.map((item) => <article className="panel" key={item.id}><div className="card-top"><div><span className="eyebrow">{item.listing?.industry || 'Business opportunity'}</span><h2>{item.listing?.publicTitle || item.listingId}</h2></div><strong>{item.status.replace('_', ' ')}</strong></div><p className="muted">Submitted {new Date(item.createdAt).toLocaleDateString()}</p>{item.message && <p>{item.message}</p>}{item.listing && <Link className="text-link" href={`/businesses/${item.listing.id}`}>Open business</Link>}</article>)}</div> : <EmptyState title="No enquiries yet" message="When you enquire about an approved business, your requests will appear here." />}</main>; }
export default function EnquiriesPage() { return <Protected roles={['INVESTOR']}><EnquiriesContent /></Protected>; }