import { Observable } from 'rxjs';

// ==========================
// |    Ports & Endpoints   |
// ==========================
export interface AuthPort {
  signinUser(request: SignInUserRequestPayload): Observable<SignInUserResponse>;
}

const AUTH_PATH = '/api/v1/auth';
// const pathSegment = (value: string): string => encodeURIComponent(value.trim());

export const authEndpoints = {
  signIn: () => `${AUTH_PATH}/login`,
} as const;

// ====================================
// |    Request & Response payloads   |
// ====================================
export interface SignInUserRequestPayload {
  email: string;
  password: string;
}

export interface SignInUserResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
}
