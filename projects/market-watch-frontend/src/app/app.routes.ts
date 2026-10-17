import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Market Watch | Create & Track Your Personal Feeding Budget',
    loadComponent: () =>
      import('./domains/landing/feature/landing-page/landing.component').then(
        (module) => module.Landing,
      ),
  },
  {
    path: 'auth',
    children: [
      {
        path: 'signup',
        title: 'Market Watch | Create your User Account',
        loadComponent: () =>
          import('./domains/user/users/features/user-registration/user-registration.component').then(
            (module) => module.UserRegistration,
          ),
      },
      {
        path: 'signin',
        title: 'Market Watch | Login to your Market Watch Account',
        loadComponent: () =>
          import('./domains/auth/features/signin/signin.component').then(
            (module) => module.Signin,
          ),
      },
    ],
  },
  {
    path: 'dashboard',
    children: [
      {
        path: 'profile/addresses',
        title: 'Market Watch | Add your Home Address',
        loadComponent: () =>
          import('./domains/user/user-address/features/address-submission/address-submission.component').then(
            (module) => module.AddressSubmission,
          ),
      },
    ],
  },
];
