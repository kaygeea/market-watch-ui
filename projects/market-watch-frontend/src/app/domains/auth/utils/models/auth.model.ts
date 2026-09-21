export interface User {
  id: string;
  email: string;
  role: string;
  status: string;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User
  }
  timestamp: string;
}

/** Shape the future `AuthStore` will populate from the API error envelope. */
export interface AuthError {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
  timestamp: string;
  error: {
    name: string;
  }
}
