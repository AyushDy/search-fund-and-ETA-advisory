export const roles = ['INVESTOR', 'STAFF', 'APPROVER', 'ADMIN'] as const;
export type Role = (typeof roles)[number];

export const accountStatuses = ['ACTIVE', 'SUSPENDED', 'DISABLED'] as const;
export type AccountStatus = (typeof accountStatuses)[number];

export interface AuthenticatedUser {
  id: string;
  role: Role;
  status: AccountStatus;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
