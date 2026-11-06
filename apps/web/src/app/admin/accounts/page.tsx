'use client';

import { useState } from 'react';
import { Protected } from '@/components/Protected';
import { api } from '@/lib/api';

function AccountsPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'STAFF' as 'STAFF' | 'APPROVER' | 'ADMIN' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function update(field: keyof typeof form, value: string) { setForm((current) => ({ ...current, [field]: value })); }
  async function submit(event: React.FormEvent) { event.preventDefault(); setBusy(true); setMessage(''); setError(''); try { const result = await api.createInternalAccount(form); setMessage(`${result.user.email} was created as ${result.user.role}.`); setForm({ firstName: '', lastName: '', email: '', password: '', role: 'STAFF' }); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create account'); } finally { setBusy(false); } }
  return <main className="narrow"><section className="detail-header"><span className="eyebrow">Administration</span><h1>Create internal account</h1><p className="muted">Provision staff and approver access. Public registration always creates investor accounts.</p></section><section className="auth-panel"><form className="form-stack" onSubmit={submit}><div className="form-grid"><label>First name<input required value={form.firstName} onChange={(event) => update('firstName', event.target.value)} /></label><label>Last name<input required value={form.lastName} onChange={(event) => update('lastName', event.target.value)} /></label></div><label>Email address<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label><label>Temporary password<input required minLength={12} type="password" value={form.password} onChange={(event) => update('password', event.target.value)} /><span className="help-text">Use at least 12 characters and transfer it securely.</span></label><label>Role<select value={form.role} onChange={(event) => update('role', event.target.value)}><option value="STAFF">Staff</option><option value="APPROVER">Approver</option><option value="ADMIN">Administrator</option></select></label>{error && <p className="error-state" role="alert">{error}</p>}{message && <p className="success-message" role="status">{message}</p>}<button className="button" disabled={busy}>{busy ? 'Creating account...' : 'Create internal account'}</button></form></section></main>;
}

export default function AdminAccountsPage() { return <Protected roles={['ADMIN']}><AccountsPage /></Protected>; }
