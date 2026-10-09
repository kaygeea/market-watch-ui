import { Component, input, output, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { RouterLink } from "@angular/router";
import { ISigninForm } from './signing-form.model';

@Component({
  selector: 'app-signin-form',
  imports: [FormField, RouterLink],
  templateUrl: './signin-form.component.html',
  styleUrl: './signin-form.component.css',
})
export class SigninForm {
  readonly submitting = input<boolean>(false);
  readonly serverError = input<string | null>(null);
  readonly formSubmit = output<ISigninForm>();
  readonly signOut = output();

  protected readonly signInModel = signal<ISigninForm>({ email: '', password: '' });

  protected readonly signinForm = form(this.signInModel, (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' });

    required(path.password, { message: 'Password is required' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.signinForm().valid()) {
      return;
    }
    this.formSubmit.emit(this.signInModel());
  }
}
