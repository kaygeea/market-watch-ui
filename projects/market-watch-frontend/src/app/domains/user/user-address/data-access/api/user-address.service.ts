import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  DeleteAddressResponse,
  GetWardsResponse,
  SubmitAddressRequestPayload,
  SubmitAddressResponse,
  userAddressEndpoints,
  UserAddressApiPort,
} from './address.api';
import states from '../resources/geo-data/states.json';
import lgas from '../resources/geo-data/lgas.json';

@Service()
export class UserAddressService implements UserAddressApiPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  submitAddress(
    userId: string,
    request: SubmitAddressRequestPayload,
  ): Observable<SubmitAddressResponse> {
    return this.http.post<SubmitAddressResponse>(
      `${this.baseUrl}${userAddressEndpoints.submitAddress(userId)}`,
      request,
    );
  }

  deleteAddress(userId: string, addressId: string): Observable<DeleteAddressResponse> {
    return this.http.delete<DeleteAddressResponse>(
      `${this.baseUrl}${userAddressEndpoints.deleteAddress(userId, addressId)}`,
    );
  }

  getStates(): string[] {
    return states as string[];
  }

  getLocalGovernments(state: string): string[] {
    return (lgas as Record<string, string[]>)[state] ?? [];
  }

  getWards(state: string, localGovernment: string): Observable<GetWardsResponse> {
    return this.http.get<GetWardsResponse>(
      `${this.baseUrl}${userAddressEndpoints.getWards(state, localGovernment)}`,
    );
  }
}
