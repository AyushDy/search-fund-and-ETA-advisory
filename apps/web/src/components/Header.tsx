'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export function Header() {
  const { user, loading, signOut } = useAuth(); const router = useRouter();
  async function logout() { await signOut(); router.push('/'); }
  return <header className="site-header"><Link className="brand" href={user ? (user.role === 'INVESTOR' ? '/dashboard' : '/staff') : '/'}><span className="brand-mark">SF</span><span>Northstar Advisory</span></Link><nav aria-label="Primary navigation">{loading ? null : user ? <><Link href="/dashboard">Dashboard</Link><Link href="/businesses">Discover</Link>{user.role === 'INVESTOR' && <><Link href="/saved-businesses">Saved</Link><Link href="/businesses/compare">Compare</Link><Link href="/account/enquiries">Enquiries</Link></>}{user.role !== 'INVESTOR' && <><Link href="/staff">Internal</Link><Link href="/staff/enquiries">Enquiries</Link></>}{user.role === 'ADMIN' && <Link href="/admin/accounts">Accounts</Link>}<Link href="/account/profile">Account</Link><button className="link-button" onClick={logout}>Sign out</button></> : <><Link href="/login">Sign in</Link><Link className="button button-small" href="/register">Create account</Link></>}</nav></header>;
}
