import { Component, input, output, signal } from '@angular/core';
import { email, form, FormField, pattern, required } from '@angular/forms/signals';

/** Matches the login request shape (no formal DTO provided in source material). */
export interface SigninFormData {
  email: string;
  password: string;
}
 
/**
 * Shape the future `AuthStore` will populate from the API error envelope's
 * `error: { name, message }`. This component renders whatever it is given —
 * it does not special-case "unverified email" vs. other failures. That
 * distinction belongs to whatever populates this signal later.
 */
export interface AuthServerError {
  name: string;
  message: string;
}

@Component({
  selector: 'app-signin-form',
  imports: [FormField],
  templateUrl: './signin-form.component.html',
  styleUrl: './signin-form.component.css',
})
export class SigninForm {
  readonly submitting = input<boolean>(false);
  readonly serverError = input<AuthServerError | null>(null);
  readonly formSubmit = output<SigninFormData>();
 
  protected readonly model = signal<SigninFormData>({ email: '', password: '' });
 
  protected readonly signinForm = form(this.model, (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' })
 
    required(path.password, { message: 'Password is required' });
  });
 
  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.signinForm().valid()) {
      return;
    }
    this.formSubmit.emit(this.model());
  }
}
