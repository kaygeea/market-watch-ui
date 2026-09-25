import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AuthResponse, LoginCredentials } from '../../utils/models/auth.model';
import { Observable } from 'rxjs';
import { userEndpoints } from '../../../users/utils/apis/user-account.api';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Authenticates user with credentials
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}${userEndpoints.signIn}`, credentials);
  }

}
