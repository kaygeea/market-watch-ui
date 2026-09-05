import { Component, signal } from '@angular/core';
import { AuthServerError, SignupForm, SignupFormData } from '../../ui/signup-form/signup-form.component';

@Component({
  selector: 'app-signup-page',
  imports: [SignupForm],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css',
})
export class SignupPage {
  protected readonly submitting = signal(false);
  protected readonly serverError = signal<AuthServerError | null>(null);
  protected readonly registrationComplete = signal(false);
 
  protected onSignupSubmit(value: SignupFormData): void {
    // TODO(data-layer): wire to AuthStore.register() once the data/ layer
    // exists. AuthStore is not built this session — this handler is a
    // deliberate stub, not a placeholder left by accident.
    //
    // The eventual implementation is expected to look roughly like:
    //   this.submitting.set(true);
    //   this.serverError.set(null);
    //   try {
    //     await this.authStore.register(value);
    //     this.registrationComplete.set(true);
    //   } catch (error) {
    //     this.serverError.set(toAuthServerError(error));
    //   } finally {
    //     this.submitting.set(false);
    //   }
    console.log(`Signup form data from signup page: ${JSON.stringify(value, null, 2)}`);
    throw new Error('Not implemented: AuthStore.register() is not wired yet.');
  }
}
