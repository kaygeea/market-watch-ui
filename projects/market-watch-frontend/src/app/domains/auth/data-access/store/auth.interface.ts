export const enum AuthStatusEnum {
  IDLE = 'idle',
  AUTHENTICATING = 'authenticating',
  AUTHENTICATED = 'authenticated',
  ERROR = 'error',
}

export type AuthStatus =
  | AuthStatusEnum.IDLE
  | AuthStatusEnum.AUTHENTICATING
  | AuthStatusEnum.AUTHENTICATED
  | AuthStatusEnum.ERROR;

