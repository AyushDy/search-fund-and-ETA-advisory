'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() { const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); async function submit(event: React.FormEvent) { event.preventDefault(); setBusy(true); setError(''); try { await api.forgotPassword(email); setMessage('If the account exists, a password reset email will be sent.'); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to request a reset'); } finally { setBusy(false); } } return <main className="narrow"><section className="auth-panel"><span className="eyebrow">Account access</span><h1>Reset your password</h1><p className="muted">Enter your email and we will send a reset link when an account matches.</p><form className="form-stack" onSubmit={submit}><label>Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>{message && <p className="success-message" role="status">{message}</p>}{error && <p className="error-state" role="alert">{error}</p>}<button className="button" disabled={busy}>{busy ? 'Requesting...' : 'Send reset link'}</button></form><Link className="text-link" href="/login">Back to sign in</Link></section></main>; }
