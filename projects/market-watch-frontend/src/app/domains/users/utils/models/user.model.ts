export interface UserAddress {
  country: string;
  state: string;
  localGovernment: string;
  ward: string;
  city: string;
  street: string;
  zipCode: string;
  longitude: string;
  latitude: string;
}

export interface UserRegistrationPayload {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  address: UserAddress
  password: string;
}