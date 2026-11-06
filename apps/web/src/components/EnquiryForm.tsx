'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export function EnquiryForm({ listingId, onSubmitted }: { listingId: string; onSubmitted?: () => void }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [saved, setSaved] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const form = new FormData(event.currentTarget); const value = (name: string) => form.get(name)?.toString().trim() || undefined; const budget = value('budget');
    try { await api.createEnquiry({ listingId, message: value('message'), budget: budget ? Number(budget) : undefined, experience: value('experience'), reason: value('reason') }); setSaved(true); event.currentTarget.reset(); onSubmitted?.(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to submit your enquiry'); }
    finally { setBusy(false); }
  }
  return <section className="panel"><h2>Enquire about this business</h2><p className="muted">Tell the advisory team what you are looking for. Your enquiry is private to you and the internal team.</p><form className="form-stack" onSubmit={submit}><label>Message<textarea name="message" maxLength={5000} placeholder="What would you like to know?" /></label><label>Indicative budget<input name="budget" type="number" min="0" /></label><label>Relevant experience<textarea name="experience" maxLength={3000} /></label><label>Why this opportunity?<textarea name="reason" maxLength={2000} /></label><div className="form-actions"><button className="button" disabled={busy} type="submit">{busy ? 'Submitting...' : 'Submit enquiry'}</button>{saved && <span className="success-message">Enquiry submitted.</span>}{error && <span className="error-state" role="alert">{error}</span>}</div></form></section>;
}