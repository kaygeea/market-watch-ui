import { Component, inject} from '@angular/core';
import { SigninForm } from '../../ui/signin-form/signin-form.component';
import { LoginCredentials } from '../../utils/models/auth.model';
import { AuthStore } from '../../data/auth-store/auth.store';

@Component({
  selector: 'app-signin-page',
  imports: [SigninForm],
  templateUrl: './signin-page.component.html',
  styleUrl: './signin-page.component.css',
})
export class SigninPage {
  protected readonly authStore = inject(AuthStore);
 
  protected onSigninSubmit(value: LoginCredentials): void {
    this.authStore.login(value);
  }

  protected onSignOutClick() {
    this.authStore.logout();
  }
}
