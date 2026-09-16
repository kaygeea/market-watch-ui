import { computed, inject } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { AuthStatus, AuthStatusEnum } from "../../utils/models/auth.interface";
import { LoginCredentials, RegisterPayload, User } from '../../utils/models/auth.model';
import { AuthService } from './auth.service';
import { TokenStorage } from '../../utils/services/token-storage.service';

interface AuthState {
  user: User | null;
  status: AuthStatus
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  status: AuthStatusEnum.IDLE,
  error: null,
}

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(({ user, status }) => ({
    isAuthenticated: computed(() => !!user()),
    isLoading: computed(() => status() === AuthStatusEnum.AUTHENTICATING),
  })),

  withMethods((
    store,
    authService = inject(AuthService),
    tokenStorage = inject(TokenStorage)
  ) => ({
    
    logout() {
      tokenStorage.clearTokens();
      patchState(store, initialState);
    },

    login: rxMethod<LoginCredentials>(
      pipe(
        tap(() => patchState(store, { status: AuthStatusEnum.AUTHENTICATING, error: null })),
        switchMap((credentials) =>
          authService.login(credentials).pipe(
            tapResponse({
              next: (response) => {
                tokenStorage.setTokens(response.accessToken, response.refreshToken);
                patchState(store, {
                  user: response.user,
                  status: AuthStatusEnum.AUTHENTICATED,
                  error: null,
                });
              },
              error: (err: Error) => {
                patchState(store, {
                  status: AuthStatusEnum.ERROR,
                  error: err.message || 'Login failed. Please check your credentials.',
                });
              },
            })
          )
        )
      )
    ),

    register: rxMethod<RegisterPayload>(
      pipe(
        tap(() => patchState(store, { status: AuthStatusEnum.AUTHENTICATING, error: null })),
        switchMap((payload) =>
          authService.register(payload).pipe(
            tapResponse({
              next: () => {
                patchState(store, { status: AuthStatusEnum.AUTHENTICATED, error: null });
              },
              error: (err: Error) => {
                patchState(store, {
                  status: AuthStatusEnum.ERROR,
                  error: err.message || 'Registration failed. Please try again.',
                });
              },
            })
          )
        )
      )
    ),
  })),

  withHooks({
    onInit(store, tokenStorage = inject(TokenStorage)) {
      const hasToken = !!tokenStorage.getAccessToken();
      patchState(store, {
        status: hasToken ? AuthStatusEnum.AUTHENTICATED : AuthStatusEnum.IDLE,
      });
    },
  })
);