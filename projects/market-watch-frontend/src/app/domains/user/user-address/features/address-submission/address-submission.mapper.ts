import { SubmitAddressRequestPayload } from "../../data-access/api/address.api";
import { IAddressSubmissionForm } from "../../ui/address-submission-form/address-submission-form.model";

export function addressSubmissionMapper(value: IAddressSubmissionForm): SubmitAddressRequestPayload {
  const ward = value.ward.trim();
  const zipCode = value.zipCode.trim();

  return {
    label: value.label.trim(),
    country: value.country,
    state: value.state,
    localGovernment: value.localGovernment,
    city: value.city.trim(),
    street: value.street.trim(),
    ...(ward ? { ward } : {}),
    ...(zipCode ? { zipCode } : {}),
    ...(value.longitude !== null ? { longitude: value.longitude } : {}),
    ...(value.latitude !== null ? { latitude: value.latitude } : {}),
  };
}