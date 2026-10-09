import { HttpErrorResponse } from '@angular/common/http';
import { getApiServerError, isApiServerError } from './api-error';

describe('isApiServerError', () => {
  it('accepts a production error response without a stack', () => {
    const response = {
      success: false,
      statusCode: 400,
      message: 'Invalid address',
      data: null,
      timestamp: '2026-10-01T00:00:00.000Z',
      error: { name: 'BadRequest' },
    };

    expect(isApiServerError(response)).toBe(true);
    expect(getApiServerError(response)).toEqual(response);
  });

  it('accepts a development error response with a stack', () => {
    expect(
      isApiServerError({
        success: false,
        statusCode: 400,
        message: ['Invalid address'],
        data: null,
        timestamp: '2026-10-01T00:00:00.000Z',
        error: { name: 'BadRequest', stack: 'stack' },
      }),
    ).toBe(true);
  });

  it('rejects values that do not match the API error contract', () => {
    expect(
      isApiServerError({
        success: true,
        statusCode: 400,
        message: 'Invalid address',
        data: null,
        timestamp: '2026-10-01T00:00:00.000Z',
        error: { name: 'BadRequest' },
      }),
    ).toBe(false);
  });

  it('extracts API errors from Angular HTTP errors', () => {
    const response = {
      success: false,
      statusCode: 400,
      message: 'Invalid address',
      data: null,
      timestamp: '2026-10-01T00:00:00.000Z',
      error: { name: 'BadRequest' },
    };

    expect(
      getApiServerError(
        new HttpErrorResponse({
          status: 400,
          error: response,
        }),
      ),
    ).toEqual(response);
  });
});
