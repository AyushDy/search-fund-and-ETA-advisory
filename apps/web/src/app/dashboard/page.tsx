'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BusinessCard } from '@/components/BusinessCard';
import { Protected } from '@/components/Protected';
import { LoadingState, ErrorState, EmptyState } from '@/components/States';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import type { BusinessListing } from '@/types';

function DashboardContent() { const { user } = useAuth(); const [listings, setListings] = useState<BusinessListing[]>([]); const [savedIds, setSavedIds] = useState<string[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); useEffect(() => { Promise.all([api.businesses('?page=1&pageSize=3&sort=newest'), api.savedBusinesses()]).then(([result, saved]) => { setListings(result.listings); setSavedIds(saved.savedBusinesses.map((item) => item.listing.id)); }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load opportunities')).finally(() => setLoading(false)); }, []); return <main><section className="detail-header"><span className="eyebrow">Investor dashboard</span><h1>Welcome back, {user?.firstName}</h1><p className="muted">Explore available business acquisition opportunities.</p><div className="button-row"><Link className="button" href="/businesses">Discover businesses</Link></div></section><div className="section-heading"><div><span className="eyebrow">Recently added</span><h2>Opportunities to explore</h2></div><Link className="text-link" href="/businesses">View all</Link></div>{loading ? <LoadingState /> : error ? <ErrorState message={error} /> : listings.length ? <div className="business-grid">{listings.map((listing) => <BusinessCard key={listing.id} listing={listing} saved={savedIds.includes(listing.id)} onSavedChange={(saved) => setSavedIds((current) => saved ? [...current, listing.id] : current.filter((id) => id !== listing.id))} />)}</div> : <EmptyState title="No opportunities yet" message="Approved opportunities will appear here when they become available." />}</main>; }
export default function DashboardPage() { return <Protected roles={['INVESTOR']}><DashboardContent /></Protected>; }
