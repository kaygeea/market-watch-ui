import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../../../shared/data-access/interfaces/api.model';
import { authEndpoints, SignInUserResponse } from './auth.api';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Authenticates user with credentials
   */
  signIn(
    email: string,
    password: string,
  ): Observable<ApiSuccessResponse<SignInUserResponse>> {
    return this.http.post<ApiSuccessResponse<SignInUserResponse>>(
      `${this.baseUrl}${authEndpoints.signIn()}`,
      {email, password},
    );
  }
}
