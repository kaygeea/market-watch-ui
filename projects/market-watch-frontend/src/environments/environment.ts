import { IEnvironment } from "./environment.interface";

export const environment: IEnvironment = {
  production: true,
  apiBaseUrl: '',
  registerEndpoint: '/api/v1/identity/users',
  signinEndpoint: '/api/v1/auth/login',
};
