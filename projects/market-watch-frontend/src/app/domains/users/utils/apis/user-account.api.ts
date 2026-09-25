import { Observable } from 'rxjs';
import { UserStatus } from '../../../../shared/models/user.model';

/** Request payload for `POST /identity/users` (registration; no address, no tokens). */
export interface RegisterUserRequestPayload {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber: string;
  password: string;
}

/** Response payload (`T`) for `POST /identity/users`. */
export interface RegisterUserResponse {
  id: string;
  status: UserStatus;
  createdAt: string;
}

/** Request payload for `PATCH /identity/users/:userId/password`. */
export interface ResetPasswordRequest {
  newPassword: string;
}

/** Response payload (`T`) for `PATCH /identity/users/:userId/password`. */
export interface ResetPasswordResponse {
  message: string;
  updatedAt: string;
}

/** Response payload (`T`) for `DELETE /identity/users/:userId`. */
export interface DeleteUserResponse {
  message: string;
  deletedAt: string;
}

/** A port that maps to available User methods on the API */
export interface UsersPort {
  registerUser(request: RegisterUserRequestPayload): Observable<RegisterUserResponse>;
  resetPassword(
    userId: string,
    request: ResetPasswordRequest,
  ): Observable<ResetPasswordResponse>;
  deleteUser(userId: string): Observable<DeleteUserResponse>;
}

const USER_PATH = '/api/v1/identity/users';

const pathSegment = (value: string): string => encodeURIComponent(value);

export const userEndpoints = {
  register: USER_PATH,
  signIn: '/api/v1/auth/login',
  verifyStatus: (userId: string) => `${USER_PATH}/${pathSegment(userId)}/status`,
  resetPassword: (userId: string) => `${USER_PATH}/${pathSegment(userId)}/password`,
  deleteUser: (userId: string) => `${USER_PATH}/${pathSegment(userId)}`,
} as const;
