import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AuthResponse, LoginCredentials, RegisterPayload, User } from '../../utils/models/auth.model';
import { Observable } from 'rxjs';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Authenticates user with credentials
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}${environment.signinEndpoint}`, credentials);
  }

  /**
   * Registers a new user account
   */
  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}${environment.registerEndpoint}`, payload);
  }
}
