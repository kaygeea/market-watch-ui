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

export interface SignupAddress {
  country: string;
  state: string;
  localGovernment: string;
  ward: string;
  city: string;
  street: string;
  zipCode: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  address: SignupAddress
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** Shape the future `AuthStore` will populate from the API error envelope. */
export interface AuthError {
  name: string;
  message: string;
}