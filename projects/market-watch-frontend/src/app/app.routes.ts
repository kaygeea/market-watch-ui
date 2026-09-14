import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'signup',
        loadComponent: () => import('./domains/auth/features/signup-page/signup-page.component').then((module) => module.SignupPage),
      },
      {
        path: 'signin',
        loadComponent: () => import('./domains/auth/features/signin-page/signin-page.component').then((module) => module.SigninPage),
      }
    ],
  }
];
