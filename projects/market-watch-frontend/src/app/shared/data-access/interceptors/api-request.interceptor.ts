import { HttpInterceptorFn } from '@angular/common/http';

export const apiRequestInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
