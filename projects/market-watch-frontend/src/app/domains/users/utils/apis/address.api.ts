import { Observable } from "rxjs";

/** API Request payload */
export interface SubmitAddressRequestPayload {
  label: string;
  country: string;
  state: string;
  localGovernment: string;
  city: string;
  ward?: string;
  street: string;
  zipCode?: string;
  longitude?: number;
  latitude?: number;
}

/** API Response payload */
export interface SubmitAddressResponse {
  id: string;
  newAddressCount: number;
  withCoordinates: boolean;
  createdAt: string;
}

/** API Response payload */
export interface DeleteAddressResponse {
  message: string;
  newAddressCount: number;
  deletedAt: string | null;
}

export interface Ward {
  name: string;
}

/** Query params for `GET /api/v1/geo/wards?state=...&lga=...`. */
export interface WardsQuery {
  state: string;
  localGovernment: string;
}

/** A port that maps to available User address methods on the API */
export interface UserAddressPort {
  submitAddress(userId: string, request: SubmitAddressRequestPayload): Observable<SubmitAddressResponse>;
  deleteAddress(userId: string, addressId: string): Observable<DeleteAddressResponse>;
  /** Fetches wards for a given state + LGA. */
  getWards(query: WardsQuery): Observable<Ward[]>;
}

const USER_PATH = '/api/v1/identity/users';

const pathSegment = (value: string): string => encodeURIComponent(value);

export const userAddressEndpoints = {
  submitAddress: (userId: string) => `${USER_PATH}/${pathSegment(userId)}/addresses`,
  deleteAddress: (userId: string, addressId: string) =>
    `${USER_PATH}/${pathSegment(userId)}/addresses/${pathSegment(addressId)}`,
  getWards: '/api/v1/geo/wards',
} as const;
