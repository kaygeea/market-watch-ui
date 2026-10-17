export interface IAddressSubmissionForm {
  label: string;
  country: string;
  state: string;
  localGovernment: string;
  ward: string;
  city: string;
  street: string;
  zipCode: string;
  longitude: number | null;
  latitude: number | null;
}

export interface IAddressWardOption {
  name: string;
  latitude: number;
  longitude: number;
}
