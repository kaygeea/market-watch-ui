import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  ApiServerError,
  RequestState,
  RequestStateEnum,
} from '../../../../shared/data-access/interfaces/api.model';
import { computed, inject } from '@angular/core';
import { UsersService } from '../../users/data-access/api/users.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { RegisterUserRequestPayload } from '../../users/data-access/api/user.api';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

interface UserRegState extends RequestState {
  newUserId: string | null;
  accountStatus: string;
}

export const initialRequestState: UserRegState = {
  newUserId: null,
  accountStatus: '',
  status: RequestStateEnum.IDLE,
  error: null,
};

export const UserRegistrationStore = signalStore(
  { providedIn: 'root' },

  withState(initialRequestState),

  withComputed(({ newUserId, status }) => ({
    isRegistered: computed(() => newUserId() !== null),
    isLoading: computed(() => status() === RequestStateEnum.PENDING),
  })),

  withMethods((store, usersService = inject(UsersService)) => ({
    register: rxMethod<RegisterUserRequestPayload>(
      pipe(
        tap(() => patchState(store, { status: RequestStateEnum.PENDING, error: null })),
        switchMap((registrationData) =>
          usersService.registerUser(registrationData).pipe(
            tapResponse({
              next: (response) => {
                patchState(store, {
                  newUserId: response.data.id,
                  accountStatus: response.data.status,
                  status: RequestStateEnum.SUCCESS,
                  error: null,
                });
              },
              error: (err: ApiServerError) => {
                patchState(store, {
                  status: RequestStateEnum.ERROR,
                  error: err || 'Sorry, we are unable to complete your registration at this time',
                });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
