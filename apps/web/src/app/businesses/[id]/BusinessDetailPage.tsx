'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Protected } from '@/components/Protected';
import { ErrorState, LoadingState } from '@/components/States';
import { api } from '@/lib/api';
import type { BusinessListing, FinancialValue } from '@/types';
import { useAuth } from '@/components/AuthProvider';
import { EnquiryForm } from '@/components/EnquiryForm';

function money(value?: FinancialValue) { return value ? `${value.currency} ${value.amount.toLocaleString()}${value.period ? ` (${value.period})` : ''}` : 'Not provided'; }

function DetailContent() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const [listing, setListing] = useState<BusinessListing | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { const savedRequest = user?.role === 'INVESTOR' ? api.savedBusinesses() : Promise.resolve({ savedBusinesses: [] }); Promise.all([api.business(params.id), savedRequest]).then(([result, savedResult]) => { setListing(result.listing); setSaved(savedResult.savedBusinesses.some((item) => item.listing.id === params.id)); }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load this opportunity')).finally(() => setLoading(false)); }, [params.id, user?.role]);
  async function toggleSaved() { setSaving(true); try { if (saved) await api.removeSavedBusiness(params.id); else await api.saveBusiness(params.id); setSaved(!saved); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to update saved businesses'); } finally { setSaving(false); } }
  if (loading) return <main><LoadingState /></main>;
  if (error || !listing) return <main><ErrorState message={error || 'Business opportunity not found'} /></main>;
  return <main><Link className="text-link" href="/businesses">&lt;- Back to businesses</Link><section className="detail-header"><span className="eyebrow">{listing.industry} · {listing.identityMode === 'ANONYMIZED' ? 'Identity withheld' : 'Identified'}</span><h1>{listing.publicTitle}</h1><p className="muted">{[listing.city, listing.region, listing.country].filter(Boolean).join(', ') || 'Location not provided'}</p>{user?.role === 'INVESTOR' && <button className="button button-secondary" type="button" onClick={() => void toggleSaved()} disabled={saving}>{saved ? 'Remove from saved' : 'Save business'}</button>}</section><div className="detail-layout"><div className="form-stack"><section className="panel"><h2>Overview</h2><p>{listing.description || listing.shortSummary}</p>{listing.productsAndServices && <><h3>Products and services</h3><p>{listing.productsAndServices}</p></>}</section><section className="panel"><h2>Financial overview</h2><div className="metric-panel"><div><span>Revenue</span><strong>{money(listing.revenue)}</strong></div><div><span>EBITDA</span><strong>{money(listing.ebitda)}</strong></div><div><span>SDE</span><strong>{money(listing.sde)}</strong></div><div><span>Asking price</span><strong>{money(listing.askingPrice)}</strong></div></div></section><section className="panel"><h2>Operations</h2><p>Years operating: {listing.yearsOperating ?? 'Not provided'}</p><p>Employees: {listing.employeeRange || 'Not provided'}</p></section></div><aside className="form-stack"><section className="panel"><h2>Interested?</h2>{user?.role === 'INVESTOR' ? <EnquiryForm listingId={listing.id} /> : <p className="muted">Sign in as an investor to enquire about this opportunity.</p>}{listing.identityMode === 'IDENTIFIED' && listing.publicWebsite && <p><a className="text-link" href={listing.publicWebsite} target="_blank" rel="noreferrer">Visit public website</a></p>}</section></aside></div></main>;
}

export default function BusinessDetailPage() { return <Protected><DetailContent /></Protected>; }