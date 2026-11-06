'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextValue { user: User | null; loading: boolean; signIn: (email: string, password: string) => Promise<User>; signUp: (input: { firstName: string; lastName: string; email: string; password: string; role?: 'INVESTOR' | 'STAFF' | 'APPROVER' | 'ADMIN' }) => Promise<User>; signOut: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { api.me().then((result) => setUser(result.user)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  async function signIn(email: string, password: string) { const result = await api.login({ email, password }); setUser(result.user); return result.user; }
  async function signUp(input: { firstName: string; lastName: string; email: string; password: string; role?: 'INVESTOR' | 'STAFF' | 'APPROVER' | 'ADMIN' }) { await api.register(input); return signIn(input.email, input.password); }
  async function signOut() { await api.logout(); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context; }
