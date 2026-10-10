import { UserRegistrationFormValue } from "../../ui/user-registration-form/user-registration-form.component";
import { UserRegistrationMapperFn } from "./user-registration.component";

export const userRegistrationMapper: UserRegistrationMapperFn = (value: UserRegistrationFormValue) => {
  const middleName = value.middleName.trim();

  return {
    firstName: value.firstName.trim(),
    lastName: value.lastName.trim(),
    ...(middleName ? { middleName } : {}),
    email: value.email.trim(),
    phoneNumber: value.phoneNumber.trim(),
    password: value.password,
  };
};