import { Component, input, output, signal } from '@angular/core';
import { email, form, FormField, maxLength, minLength, PathKind, pattern, required, SchemaPath, validate } from '@angular/forms/signals';

/**
 * Mirrors `RegisterNewUserRequestDto` (market-watch-api, IAM module) field
 * for field. This type is intentionally colocated here rather than in
 * `data/` — the DTO/mapper layer is deferred to the AuthStore session.
 * When `data/` is built, reconcile this with the real DTO import instead
 * of duplicating it further.
 */
export interface SignupFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  ward: string;
  localGovernment: string;
  state: string;
  zipCode: string;
  country: string;
  password: string;
}
 
/** Shape the future `AuthStore` will populate from the API error envelope. */
export interface AuthServerError {
  name: string;
  message: string;
}
 
const EMPTY_SIGNUP_FORM_VALUE: SignupFormData = {
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  phoneNumber: '',
  street: '',
  city: '',
  ward: '',
  localGovernment: '',
  state: '',
  zipCode: '',
  country: '',
  password: '',
};

@Component({
  selector: 'app-signup-form',
  imports: [FormField],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css',
})
export class SignupForm {
  readonly submitting = input<boolean>(false);
  readonly serverError = input<AuthServerError | null>(null);
  readonly formSubmit = output<SignupFormData>();
  protected readonly signupModel = signal<SignupFormData>({ ...EMPTY_SIGNUP_FORM_VALUE });

  protected readonly signupForm = form(this.signupModel, (path) => {
    required(path.firstName, { message: 'First name is required' });
    minLength(path.firstName, 2, { message: 'First name must be at least 2 characters' });
    maxLength(path.firstName, 40, { message: 'First name must be at most 40 characters' });
 
    required(path.lastName, { message: 'Last name is required' });
    minLength(path.lastName, 2, { message: 'Last name must be at least 2 characters' });
    maxLength(path.lastName, 40, { message: 'Last name must be at most 40 characters' });
 
    // middleName is optional — only length-validated when present.
    const middleNamePath = path.middleName as SchemaPath<string, 1, PathKind.Child>;
    
    if (middleNamePath) {
      minLength(middleNamePath, 2, {
        message: 'Middle name must be at least 2 characters',
      });
      maxLength(middleNamePath, 40, {
        message: 'Middle name must be at most 40 characters',
      });
    }
 
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' })
 
    required(path.phoneNumber, { message: 'Phone number is required' });
    // Loose UX check only — full en-NG mobile number validation happens server-side.
    minLength(path.phoneNumber, 10, { message: 'Enter a valid phone number' });
 
    required(path.street, { message: 'Street is required' });
    required(path.city, { message: 'City is required' });
    required(path.localGovernment, { message: 'Local government is required' });
    required(path.state, { message: 'State is required' });
    required(path.country, { message: 'Country is required' });
 
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
    console.log(`Submitting form data: ${JSON.stringify(this.signupModel(), null, 2)}`);
    this.formSubmit.emit(this.signupModel());
  }
}
