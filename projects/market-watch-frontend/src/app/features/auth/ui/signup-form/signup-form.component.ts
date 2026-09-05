import { Component, effect, input, output, signal } from '@angular/core';
import { disabled, email, form, FormField, maxLength, minLength, PathKind, readonly, required, SchemaPath, validate } from '@angular/forms/signals';
import { AuthServerError, SignupFormData } from './signup-form.interfaces';
import { RouterLink } from '@angular/router';
 
const EMPTY_SIGNUP_FORM_VALUE: SignupFormData = {
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  phoneNumber: '',
  address: {
    country: 'Nigeria',
    state: '',
    localGovernment: '',
    ward: '',
    city: '',
    street: '',
    zipCode: '',
  },
  password: '',
};

@Component({
  selector: 'app-signup-form',
  imports: [RouterLink, FormField],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css',
})
export class SignupForm {
  readonly submitting = input<boolean>(false);
  readonly serverError = input<AuthServerError | null>(null);
  readonly stateOptions = input<string[]>([]);
  readonly statesLoading = input<boolean>(false);
  readonly localGovernmentOptions = input<string[]>([]);
  readonly localGovernmentsLoading = input<boolean>(false);
  readonly wardOptions = input<string[]>([]);
  readonly wardsLoading = input<boolean>(false);

  readonly stateFieldFocused = output<void>();
  readonly stateSelected = output<string>();
  readonly localGovernmentSelected = output<string>();
  readonly formSubmit = output<SignupFormData>();

  private readonly lastSelectedState = signal<string | undefined>(undefined);
  private readonly lastSelectedLocalGovernment = signal<string | undefined>(undefined);

  protected readonly signupModel = signal<SignupFormData>({ ...EMPTY_SIGNUP_FORM_VALUE });

  constructor() {
    effect(() => {
      const state = this.signupForm.address.state().value();
      const previousState = this.lastSelectedState();

      if (!state || state === previousState) {
        return;
      }

      this.lastSelectedState.set(state);
      this.stateSelected.emit(state);
      this.signupForm.address.localGovernment().value.set('');
      this.signupForm.address.ward().value.set('');
    });

    effect(() => {
      const localGovernment = this.signupForm.address.localGovernment().value();
      const previousLocalGovernment = this.lastSelectedLocalGovernment();

      if (!localGovernment || localGovernment === previousLocalGovernment) {
        return;
      }

      this.lastSelectedLocalGovernment.set(localGovernment);
      this.localGovernmentSelected.emit(localGovernment);
      this.signupForm.address.ward().value.set('');
    });
  }

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
 
    required(path.address.street, { message: 'Street is required' });
    required(path.address.city, { message: 'City is required' });
    required(path.address.state, { message: 'State is required' });
    required(path.address.localGovernment, { message: 'Local government is required' });
    required(path.address.ward, { message: 'Ward is required' });
    required(path.address.country, { message: 'Country is required' });
    readonly(path.address.country)

    disabled(path.address.localGovernment, {
      when: () => this.localGovernmentOptions().length === 0,
    });

    disabled(path.address.ward, {
      when: () => this.wardOptions().length === 0,
    });

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
    this.formSubmit.emit(this.signupModel());
  }
}
