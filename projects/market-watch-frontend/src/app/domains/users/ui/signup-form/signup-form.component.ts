import { Component, effect, input, output, signal } from '@angular/core';
import { disabled, email, form, FormField, maxLength, minLength, readonly, required, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { RegisterUserRequestPayload } from '../../utils/apis/user-account.api';

interface SignupFormValue {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const EMPTY_SIGNUP_FORM_VALUE: SignupFormValue = {
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  phoneNumber: '',
  password: '',
};

function toRegisterUserRequest(value: SignupFormValue): RegisterUserRequestPayload {
  const middleName = value.middleName.trim();

  return {
    firstName: value.firstName.trim(),
    lastName: value.lastName.trim(),
    ...(middleName ? { middleName } : {}),
    email: value.email.trim(),
    phoneNumber: value.phoneNumber.trim(),
    password: value.password,
  };
}

@Component({
  selector: 'app-signup-form',
  imports: [RouterLink, FormField],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css',
})
export class SignupForm {
  readonly submitting = input<boolean>(false);
  readonly serverError = input<string | null>(null);
  readonly formSubmit = output<RegisterUserRequestPayload>();

  protected readonly signupModel = signal<SignupFormValue>({ ...EMPTY_SIGNUP_FORM_VALUE });

  protected readonly signupForm = form(this.signupModel, (path) => {
    // First name
    required(path.firstName, { message: 'First name is required' });
    minLength(path.firstName, 2, { message: 'First name must be at least 2 characters' });
    maxLength(path.firstName, 40, { message: 'First name must be at most 40 characters' });
 
    // Last name
    required(path.lastName, { message: 'Last name is required' });
    minLength(path.lastName, 2, { message: 'Last name must be at least 2 characters' });
    maxLength(path.lastName, 40, { message: 'Last name must be at most 40 characters' });
 
    // Middle name is optional; validate it only when the user enters one.
    minLength(path.middleName, 2, {
      message: 'Middle name must be at least 2 characters',
    });
    maxLength(path.middleName, 40, {
      message: 'Middle name must be at most 40 characters',
    });
 
    // Email
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' })

    // Phone number
    required(path.phoneNumber, { message: 'Phone number is required' });
    minLength(path.phoneNumber, 11, { message: 'A valid 11 digit Nigerian phone number is required' });
    maxLength(path.phoneNumber, 11, { message: 'A valid 11 digit Nigerian phone number is required' });
 
    // Password
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, { message: 'Password must be at least 8 characters' });
    validate(path.password, ({ value }) => {
      const password = value();
      if (!password) {
        return null;
      }
      const hasNumber = /\d/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      if (hasNumber && hasUppercase) {
        return null;
      }
      return {
        kind: 'weakPassword',
        message: 'Password must include at least one number and one uppercase letter',
      };
    });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.signupForm().valid()) {
      return;
    }
    this.formSubmit.emit(toRegisterUserRequest(this.signupModel()));
  }
}
