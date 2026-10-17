import { Environment } from './environment.interface';

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
} satisfies Environment;
