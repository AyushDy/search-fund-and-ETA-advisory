'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BusinessCard } from '@/components/BusinessCard';
import { Protected } from '@/components/Protected';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { api } from '@/lib/api';
import type { SavedBusiness } from '@/types';

function SavedBusinessesContent() {
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { api.savedBusinesses().then((result) => setSavedBusinesses(result.savedBusinesses)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load saved businesses')).finally(() => setLoading(false)); }, []);
  function remove(listingId: string) { setSavedBusinesses((current) => current.filter((saved) => saved.listing.id !== listingId)); }
  return <main><section className="detail-header"><span className="eyebrow">Investor workspace</span><h1>Saved businesses</h1><p className="muted">Keep a shortlist of approved opportunities for later review.</p>{savedBusinesses.length > 1 && <div className="button-row"><Link className="button" href="/businesses/compare">Compare saved businesses</Link></div>}</section>{loading ? <LoadingState /> : error ? <ErrorState message={error} /> : savedBusinesses.length ? <div className="business-grid">{savedBusinesses.map((saved) => <BusinessCard key={saved.id} listing={saved.listing} saved onSavedChange={(isSaved) => { if (!isSaved) remove(saved.listing.id); }} />)}</div> : <EmptyState title="No saved businesses" message="Save an approved opportunity from the directory to build your shortlist." />}</main>;
}

export default function SavedBusinessesPage() { return <Protected roles={['INVESTOR']}><SavedBusinessesContent /></Protected>; }