'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

type RegistrationRole = 'INVESTOR' | 'STAFF' | 'APPROVER' | 'ADMIN';

export default function RegisterPage() {
  const { signUp } = useAuth(); const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', role: 'INVESTOR' as RegistrationRole });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  function update(key: keyof typeof form, value: string) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(event: React.FormEvent) { event.preventDefault(); setError(''); if (form.password !== form.confirm) { setError('Passwords must match'); return; } setBusy(true); try { const user = await signUp(form); router.push(user.role === 'INVESTOR' ? '/dashboard' : user.role === 'ADMIN' ? '/admin/accounts' : '/staff'); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create account'); } finally { setBusy(false); } }
  return <main className="narrow"><section className="auth-panel"><span className="eyebrow">Account access</span><h1>Create your account</h1><p className="muted">Public internal-role registration is enabled for this development environment.</p><form className="form-stack" onSubmit={submit}><div className="form-grid"><label>First name<input required value={form.firstName} onChange={(event) => update('firstName', event.target.value)} /></label><label>Last name<input required value={form.lastName} onChange={(event) => update('lastName', event.target.value)} /></label></div><label>Email address<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label><label>Password<input required minLength={12} type="password" value={form.password} onChange={(event) => update('password', event.target.value)} /><span className="help-text">Use at least 12 characters.</span></label><label>Confirm password<input required type="password" value={form.confirm} onChange={(event) => update('confirm', event.target.value)} /></label><label>Role<select value={form.role} onChange={(event) => update('role', event.target.value)}><option value="INVESTOR">Investor</option><option value="STAFF">Staff</option><option value="APPROVER">Approver</option><option value="ADMIN">Administrator</option></select></label>{error && <p className="error-state" role="alert">{error}</p>}<button className="button" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button></form><p className="muted">Already registered? <Link className="text-link" href="/login">Sign in</Link></p></section></main>;
}
