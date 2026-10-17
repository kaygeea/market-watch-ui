import { HttpErrorResponse } from '@angular/common/http';
import { ApiServerError } from './interfaces/api.model';

export function isApiServerError(value: unknown): value is ApiServerError {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (
    !('success' in value) ||
    value.success !== false ||
    !('statusCode' in value) ||
    typeof value.statusCode !== 'number' ||
    !('message' in value) ||
    (typeof value.message !== 'string' &&
      (!Array.isArray(value.message) || !value.message.every((item) => typeof item === 'string'))) ||
    !('data' in value) ||
    value.data !== null ||
    !('timestamp' in value) ||
    typeof value.timestamp !== 'string' ||
    !('error' in value) ||
    typeof value.error !== 'object' ||
    value.error === null ||
    !('name' in value.error) ||
    typeof value.error.name !== 'string'
  ) {
    return false;
  }

  return !('stack' in value.error) || typeof value.error.stack === 'string';
}

export function getApiServerError(error: unknown): ApiServerError | null {
  const responseBody = error instanceof HttpErrorResponse ? error.error : error;
  return isApiServerError(responseBody) ? responseBody : null;
}
