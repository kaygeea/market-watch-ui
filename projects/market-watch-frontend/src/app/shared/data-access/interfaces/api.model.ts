/** Standard success envelope returned by every endpoint; `T` is the endpoint's own payload. */
export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Market Watch API error shape
 */
export interface ApiServerError {
  success: false;
  statusCode: number;
  message: string | string[];
  data: null;
  timestamp: string;
  error: {
    name: string;
    stack?: string;
  };
}

export const enum RequestStateEnum {
  IDLE = 'Idle',
  PENDING = 'Pending',
  SUCCESS = 'Success',
  ERROR = 'Error'
};

export interface RequestState {
  status:  `${RequestStateEnum}`
  error: ApiServerError | null;
}

export const initialRequestState: RequestState = {
  status: RequestStateEnum.IDLE,
  error: null,
};