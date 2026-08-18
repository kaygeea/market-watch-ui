import { Routes } from '@angular/router';
import { App } from './app.component';
import { SignupForm } from './features/auth/ui/signup-form/signup-form.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   component: App
  // },
  {
    path: 'auth/signup',
    component: SignupForm
  }
];
