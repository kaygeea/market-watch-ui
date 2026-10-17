import { Component, inject} from '@angular/core';
import { SigninForm } from '../../ui/signin-form/signin-form.component';
import { AuthStore } from '../../data-access/store/auth.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [RouterLink, SigninForm],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class Signin {
  protected readonly authStore = inject(AuthStore);
 
  protected onSignInFormSubmit(value: {email: string, password: string}): void {
    this.authStore.login(value);
  }

  protected onSignOutClick() {
    if (!this.authStore.isAuthenticated()) {
      return;
    }

    this.authStore.logout();
  }
}
