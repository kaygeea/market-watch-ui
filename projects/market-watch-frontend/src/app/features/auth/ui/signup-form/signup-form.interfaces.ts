/**
 * Mirrors `RegisterNewUserRequestDto` (market-watch-api, IAM module) field
 * for field. This type is intentionally colocated here rather than in
 * `data/` — the DTO/mapper layer is deferred to the AuthStore session.
 * When `data/` is built, reconcile this with the real DTO import instead
 * of duplicating it further.
 */
export interface SignupFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  ward: string;
  localGovernment: string;
  state: string;
  zipCode: string;
  country: string;
  password: string;
}

/** Shape the future `AuthStore` will populate from the API error envelope. */
export interface AuthServerError {
  name: string;
  message: string;
}
