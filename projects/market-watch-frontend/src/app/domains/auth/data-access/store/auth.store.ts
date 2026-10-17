import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { AuthStatus, AuthStatusEnum } from './auth.interface';
import { AuthService } from '../api/auth.service';
import { TokenStorage } from '../../utils/services/token-storage.service';
import { getApiServerError } from '../../../../shared/data-access/api-error';

interface AuthState {
  user: string | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: AuthStatusEnum.IDLE,
  error: null,
};

function getApiErrorMessage(error: unknown): string | null {
  const response = getApiServerError(error);
  if (!response) {
    return null;
  }

  const message = response.message;
  if (typeof message === 'string') {
    return message;
  }

  if (Array.isArray(message)) {
    return message.filter((item): item is string => typeof item === 'string').join('. ');
  }

  return null;
}

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(({ status }) => ({
    isAuthenticated: computed(() => status() === AuthStatusEnum.AUTHENTICATED),
    isLoading: computed(() => status() === AuthStatusEnum.AUTHENTICATING),
  })),

  withMethods(
    (store, authService = inject(AuthService), tokenStorage = inject(TokenStorage)) => ({
      logout() {
        tokenStorage.clearTokens();
        patchState(store, initialState);
      },

      login: rxMethod<{email: string, password: string}>(
        pipe(
          tap(() =>
            patchState(store, { status: AuthStatusEnum.AUTHENTICATING, error: null }),
          ),
          switchMap((credentials) =>
            authService.signIn(credentials.email, credentials.password).pipe(
              tapResponse({
                next: (response) => {
                  tokenStorage.setTokens(
                    response.data.accessToken,
                    response.data.refreshToken,
                  );
                  patchState(store, {
                    user: response.data.user.id,
                    status: AuthStatusEnum.AUTHENTICATED,
                    error: null,
                  });
                },
                error: (err: HttpErrorResponse) => {
                  patchState(store, {
                    status: AuthStatusEnum.ERROR,
                    error:
                      getApiErrorMessage(err) ||
                      (err.status === 0
                        ? 'Unable to reach the server. Check your connection and try again.'
                        : 'Login failed. Please check your credentials.'),
                  });
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),

  withHooks({
    onInit(store, tokenStorage = inject(TokenStorage)) {
      const hasToken = !!tokenStorage.getAccessToken();
      patchState(store, {
        status: hasToken ? AuthStatusEnum.AUTHENTICATED : AuthStatusEnum.IDLE,
      });
    },
  }),
);
