'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function VerifyEmailPage() { const [status, setStatus] = useState('Verifying your email...'); const [error, setError] = useState(''); useEffect(() => { const token = new URLSearchParams(window.location.search).get('token'); if (!token) { setError('This verification link is missing its token.'); return; } api.verifyEmail(token).then(() => setStatus('Your email has been verified.')).catch((reason) => { setError(reason instanceof Error ? reason.message : 'Unable to verify email'); setStatus('Verification could not be completed.'); }); }, []); return <main className="narrow"><section className="auth-panel"><span className="eyebrow">Account access</span><h1>{status}</h1>{error && <p className="error-state" role="alert">{error}</p>}<Link className="button" href="/login">Continue to sign in</Link></section></main>; }
