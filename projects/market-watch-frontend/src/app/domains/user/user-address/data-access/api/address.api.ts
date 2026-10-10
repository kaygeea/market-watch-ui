import { Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../../../../shared/data-access/interfaces/api.model';

// ==========================
// |    Ports & Endpoints   |
// ==========================

/** A port that maps to available User address methods on the API */
export interface UserAddressApiPort {
  submitAddress(
    userId: string,
    request: SubmitAddressRequestPayload,
  ): Observable<SubmitAddressResponse>;
  deleteAddress(userId: string, addressId: string): Observable<DeleteAddressResponse>;
  getStates(): string[];
  getLocalGovernments(state: string): string[];
  /** Fetches local government wards for a given state + LGA. */
  getWards(state: string, localGovernment: string): Observable<GetWardsResponse>;
}

const USER_PATH = '/api/v1/identity/users';

const pathSegment = (value: string): string => encodeURIComponent(value.trim());

export const userAddressEndpoints = {
  submitAddress: (userId: string) => `${USER_PATH}/${pathSegment(userId)}/addresses`,
  deleteAddress: (userId: string, addressId: string) =>
    `${USER_PATH}/${pathSegment(userId)}/addresses/${pathSegment(addressId)}`,
  getWards: (state: string, localGovernment: string) =>
    `/api/v1/geo/locations/lgas/wards?state=${state}&lga=${localGovernment}`,
} as const;

// ====================================
// |    Request & Response payloads   |
// ====================================
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

export type SubmitAddressResponse = ApiSuccessResponse<SubmitAddressResponseData>;

export interface SubmitAddressResponseData {
  id: string;
  newAddressCount: number;
  withCoordinates: boolean;
  createdAt: string;
}

export type DeleteAddressResponse = ApiSuccessResponse<DeleteAddressResponseData>;

export interface DeleteAddressResponseData {
  message: string;
  newAddressCount: number;
  deletedAt: string | null;
}

/** Query params for `GET /api/v1/geo/wards?state=...&lga=...`. */
export interface WardsQuery {
  state: string;
  localGovernment: string;
}

export interface NigeriaGeoJsonWard {
  name: string;
  latitude: number;
  longitude: number;
};

export type GetWardsResponse = ApiSuccessResponse<GetWardsResponseData>;

export class GetWardsResponseData {
  wardsCount!: number;
  state!: string;
  localGovernment!: string;
  wardsWithCoordinates!: NigeriaGeoJsonWard[];
}
