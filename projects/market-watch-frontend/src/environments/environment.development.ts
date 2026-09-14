import { IEnvironment } from "./environment.interface";

export const environment: IEnvironment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
  registerEndpoint: '/api/v1/identity/users',
  signinEndpoint: '/api/v1/auth/login',
};
