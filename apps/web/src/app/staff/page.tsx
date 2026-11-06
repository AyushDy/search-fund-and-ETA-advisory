'use client';

import Link from 'next/link';
import { Protected } from '@/components/Protected';
import { ListingForm } from '@/components/ListingForm';

function StaffContent() { return <main><section className="detail-header"><span className="eyebrow">Internal workspace</span><h1>Staff dashboard</h1><p className="muted">Manage sourced businesses and prepare listings for review.</p><div className="button-row"><Link className="button" href="/staff/listings/new">Create new listing</Link><Link className="button button-secondary" href="/staff/listings">View listings</Link></div></section><section className="panel"><h2>Listing workflow</h2><p className="muted">Create a draft, add the information available to your team, and submit it for an approver to review. Investor visibility only begins after approval.</p></section></main>; }
export default function StaffPage() { return <Protected roles={['STAFF', 'APPROVER', 'ADMIN']}><StaffContent /></Protected>; }
