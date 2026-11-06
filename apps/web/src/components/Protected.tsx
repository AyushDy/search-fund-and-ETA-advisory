'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { LoadingState } from './States';
import type { Role } from '@/types';

function landingPageForRole(role: Role): string {
	if (role === 'INVESTOR') return '/dashboard';
	if (role === 'ADMIN') return '/admin/accounts';
	if (role === 'APPROVER') return '/approver/review';
	return '/staff';
}

export function Protected({ children, roles }: { children: React.ReactNode; roles?: Role[] }) {
	const { user, loading } = useAuth();
	const router = useRouter();
	const unauthorized = Boolean(user && roles && !roles.includes(user.role));

	useEffect(() => {
		if (loading) return;
		if (!user) {
			router.replace('/login');
			return;
		}
		if (roles && !roles.includes(user.role)) router.replace(landingPageForRole(user.role));
	}, [loading, user, roles, router]);

	if (loading || !user || unauthorized) return <LoadingState label="Checking access" />;
	return <>{children}</>;
}
