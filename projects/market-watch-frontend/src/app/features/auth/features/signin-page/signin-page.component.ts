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
    // TODO(data-layer): wire to AuthStore.login() once the data/ layer
    // exists. AuthStore is not built this session — this handler is a
    // deliberate stub, not a placeholder left by accident.
    //
    // Verification gating (e.g. "unverified email") is resolved server-side
    // by the /login endpoint itself, not pre-checked here. The eventual
    // implementation is expected to look roughly like:
    //   this.submitting.set(true);
    //   this.serverError.set(null);
    //   try {
    //     await this.authStore.login(value);
    //     // navigate on success
    //   } catch (error) {
    //     this.serverError.set(toAuthServerError(error));
    //   } finally {
    //     this.submitting.set(false);
    //   }
    console.log(`Signin form data from signin page: ${JSON.stringify(value, null, 2)}`);
    throw new Error('Not implemented: AuthStore.login() is not wired yet.');
  }
}
