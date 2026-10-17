// ============================================================================
// Both `auth` and `user` domains import from here; neither domain
// depends on the other directly.
// ============================================================================

/**
 * Backend account states, as returned by the API
 */
export enum UserStatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

/** The type used wherever a user's status crosses the API boundary. */
export type UserStatus = `${UserStatusEnum}`;

/**
 * Session-identity shape, as currently held by `auth` domain
 */
export interface User {
  id: string;
  email: string;
  role: string;
  status: UserStatus;
}