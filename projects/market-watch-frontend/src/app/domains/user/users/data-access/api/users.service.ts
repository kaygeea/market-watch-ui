import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import {
  DeleteUserResponse,
  RegisterUserRequestPayload,
  RegisterUserResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  usersEndpoints,
  UsersApiPort,
} from '../api/user.api';

@Service()
export class UsersService implements UsersApiPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Registers a new user account
   */
  registerUser(request: RegisterUserRequestPayload): Observable<RegisterUserResponse> {
    return this.http.post<RegisterUserResponse>(
      `${this.baseUrl}${usersEndpoints.register}`,
      request,
    );
  }

  resetPassword(
    userId: string,
    request: ResetPasswordRequest,
  ): Observable<ResetPasswordResponse> {
    return this.http.patch<ResetPasswordResponse>(
      `${this.baseUrl}${usersEndpoints.resetPassword(userId)}`,
      request,
    );
  }

  deleteUser(userId: string): Observable<DeleteUserResponse> {
    return this.http.delete<DeleteUserResponse>(
      `${this.baseUrl}${usersEndpoints.deleteUser(userId)}`,
    );
  }
}
