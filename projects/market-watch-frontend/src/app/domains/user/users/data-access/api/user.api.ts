import { Observable } from "rxjs";
import { ApiSuccessResponse } from "../../../../../shared/data-access/interfaces/api.model";
import { UserStatus } from "../../../../../shared/data-access/interfaces/user.model";

// ==========================
// |   Ports & Endpoints    |
// ==========================

export interface UsersApiPort {
  registerUser(request: RegisterUserRequestPayload): Observable<RegisterUserResponse>;
  resetPassword(
    userId: string,
    request: ResetPasswordRequest,
  ): Observable<ResetPasswordResponse>;
  deleteUser(userId: string): Observable<DeleteUserResponse>;
}

const USER_PATH = '/api/v1/identity/users';

const pathSegment = (value: string): string => encodeURIComponent(value);

export const usersEndpoints = {
  register: USER_PATH,
  verifyStatus: (userId: string) => `${USER_PATH}/${pathSegment(userId)}/status`,
  resetPassword: (userId: string) => `${USER_PATH}/${pathSegment(userId)}/password`,
  deleteUser: (userId: string) => `${USER_PATH}/${pathSegment(userId)}`,
} as const;


// ====================================
// |    Request & Response payloads   |
// ====================================

export interface RegisterUserRequestPayload {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export type RegisterUserResponse = ApiSuccessResponse<RegisterUserResponseData>;

export interface RegisterUserResponseData {
  id: string;
  status: UserStatus;
  createdAt: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export type ResetPasswordResponse = ApiSuccessResponse<ResetPasswordResponseData>;

export interface ResetPasswordResponseData {
  message: string;
  updatedAt: string;
}

export type DeleteUserResponse = ApiSuccessResponse<DeleteUserResponseData>;

export interface DeleteUserResponseData {
  message: string;
  deletedAt: string;
}
