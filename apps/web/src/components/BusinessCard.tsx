import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { api } from '@/lib/api';
import type { BusinessListing, FinancialValue } from '@/types';

function money(value?: FinancialValue) { return value ? `${value.currency} ${value.amount.toLocaleString()}` : 'Not provided'; }
export function BusinessCard({ listing, saved = false, onSavedChange }: { listing: BusinessListing; saved?: boolean; onSavedChange?: (saved: boolean) => void }) {
	const { user } = useAuth(); const [isSaved, setIsSaved] = useState(saved); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
	async function toggleSaved() { setSaving(true); setError(''); try { if (isSaved) await api.removeSavedBusiness(listing.id); else await api.saveBusiness(listing.id); const next = !isSaved; setIsSaved(next); onSavedChange?.(next); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to update saved businesses'); } finally { setSaving(false); } }
	return <article className="business-card"><div className="card-top"><div><span className="eyebrow">{listing.industry}</span><h3>{listing.publicTitle}</h3></div><span className="identity-label">{listing.identityMode === 'ANONYMIZED' ? 'Identity withheld' : 'Identified'}</span></div><p>{listing.shortSummary}</p><div className="metrics"><div><span>Revenue</span><strong>{money(listing.revenue)}</strong></div><div><span>Asking price</span><strong>{money(listing.askingPrice)}</strong></div><div><span>Location</span><strong>{[listing.city, listing.region, listing.country].filter(Boolean).join(', ') || 'Not provided'}</strong></div></div><div className="card-actions"><Link className="text-link" href={`/businesses/${listing.id}`}>View details <span aria-hidden="true">-&gt;</span></Link>{user?.role === 'INVESTOR' && <button className="save-button" type="button" onClick={() => void toggleSaved()} disabled={saving} aria-pressed={isSaved}>{isSaved ? 'Saved' : 'Save'}</button>}</div>{error && <p className="error-text">{error}</p>}</article>;
}
