import { Component, signal } from '@angular/core';
import { AuthServerError, SigninForm, SigninFormData } from '../../ui/signin-form/signin-form.component';

@Component({
  selector: 'app-signin-page',
  imports: [SigninForm],
  templateUrl: './signin-page.component.html',
  styleUrl: './signin-page.component.css',
})
export class SigninPage {
  protected readonly submitting = signal(false);
  protected readonly serverError = signal<AuthServerError | null>(null);
 
  protected onSigninSubmit(value: SigninFormData): void {
    this.submitting.set(true);
    this.serverError.set(null);

    console.log(`Signin form data from signin page: ${JSON.stringify(value, null, 2)}`);

    // This is an intentional local-only stub until the API/auth-store layer is
    // connected. The page still follows the guide pattern by managing loading
    // and server error state instead of crashing the UI.
    setTimeout(() => {
      this.serverError.set({
        name: 'AuthNotConfigured',
        message: 'Authentication is not yet connected to the backend.',
      });
      this.submitting.set(false);
    }, 250);
  }
}
