import { Component, inject, InjectionToken } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  UserRegistrationForm,
  UserRegistrationFormValue,
} from '../../ui/user-registration-form/user-registration-form.component';
import { RegisterUserRequestPayload } from '../../../users/data-access/api/user.api';
import { FeatureMapperFn } from '../../../../../shared/features/feature-mapper.interface';
import { userRegistrationMapper } from './user-registration.mapper';
import { UserRegistrationStore } from '../../../shared/store/user.store';

export type UserRegistrationMapperFn = FeatureMapperFn<
  UserRegistrationFormValue,
  RegisterUserRequestPayload
>;
export const USER_REGISTRATION_MAPPER_TOKEN =
  new InjectionToken<UserRegistrationMapperFn>(
    'user_registration.data_mapper_function', // Custom debug string label
  );

@Component({
  selector: 'app-user-registration',
  imports: [RouterLink, UserRegistrationForm],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.css',
  providers: [
    {
      provide: USER_REGISTRATION_MAPPER_TOKEN,
      useValue: userRegistrationMapper,
    }
  ]
})
export class UserRegistration {
  protected readonly userRegStore = inject(UserRegistrationStore);
  protected readonly userRegMapper = inject(USER_REGISTRATION_MAPPER_TOKEN);

  protected onSignupSubmit(value: UserRegistrationFormValue): void {
    const apiValue = this.userRegMapper(value);
    this.userRegStore.register(apiValue);
  }
}
