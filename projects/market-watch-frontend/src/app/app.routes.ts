import { Routes } from '@angular/router';
import { SignupPage } from './domains/auth/features/signup-page/signup-page.component';
import { SigninPage } from './domains/auth/features/signin-page/signin-page.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'signup',
        component: SignupPage,
      },
      {
        path: 'signin',
        component: SigninPage,
      }
    ],
  }
];
