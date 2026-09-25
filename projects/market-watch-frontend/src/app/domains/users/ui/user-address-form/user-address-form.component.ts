import { Component, effect, input, output, signal } from '@angular/core';
import { disabled, form, FormField, hidden, readonly, required } from '@angular/forms/signals';
import { SubmitAddressRequestPayload } from '../../utils/apis/address.api';

interface UserAddressFormValue {
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

const EMPTY_USER_ADDRESS_FORM_VALUE: UserAddressFormValue = {
  label: '',
  country: 'Nigeria',
  state: '',
  localGovernment: '',
  ward: '',
  city: '',
  street: '',
  zipCode: '',
  longitude: null,
  latitude: null,
};

function toSubmitAddressRequest(value: UserAddressFormValue): SubmitAddressRequestPayload {
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

@Component({
  selector: 'app-user-address-form',
  imports: [FormField],
  templateUrl: './user-address-form.component.html',
  styleUrl: './user-address-form.component.css',
})
export class UserAddressForm {
  readonly submitting = input<boolean>(false);
  readonly serverError = input<string | null>(null);

  protected readonly userAddressModel = signal<UserAddressFormValue>({ ...EMPTY_USER_ADDRESS_FORM_VALUE });

  // State selection variables
  readonly stateFieldFocused = output<void>();
  readonly statesLoading = input<boolean>(false);
  readonly stateOptions = input<string[]>([]);
  readonly stateSelected = output<string>();
  private readonly lastSelectedState = signal<string | undefined>(undefined);

  // Local government selection variables
  readonly localGovernmentsLoading = input<boolean>(false);
  readonly localGovernmentOptions = input<string[]>([]);
  readonly localGovernmentSelected = output<string>();
  private readonly lastSelectedLocalGovernment = signal<string | undefined>(undefined);

  // Ward selection variables
  readonly wardsLoading = input<boolean>(false);
  readonly wardOptions = input<string[]>([]);

  readonly formSubmit = output<SubmitAddressRequestPayload>();

  constructor() {
    // State selection in address form
    effect(() => {
      const state = this.userAddressForm.state().value();
      const previousState = this.lastSelectedState();

      if (!state || state === previousState) {
        return;
      }

      this.lastSelectedState.set(state);
      this.stateSelected.emit(state);
      this.userAddressForm.localGovernment().value.set('');
      this.userAddressForm.ward().value.set('');
    });

    effect(() => {
    // Local Government selection in address form
      const localGovernment = this.userAddressForm.localGovernment().value();
      const previousLocalGovernment = this.lastSelectedLocalGovernment();

      if (!localGovernment || localGovernment === previousLocalGovernment) {
        return;
      }

      this.lastSelectedLocalGovernment.set(localGovernment);
      this.localGovernmentSelected.emit(localGovernment);
      this.userAddressForm.ward().value.set('');
    });
  }

  protected readonly userAddressForm = form(this.userAddressModel, (path) => {
    // Country
    readonly(path.country)
    required(path.country, { message: 'Country is required' });

    // State
    required(path.state, { message: 'State is required' });
    disabled(path.state, {
      when: () => this.userAddressForm.country().value().length === 0,
    });

    // Local government
    required(path.localGovernment, { message: 'Local government is required' });
    disabled(path.localGovernment, {
      when: () => this.localGovernmentOptions().length === 0,
    });

    // Ward
    if (path.ward) {
      required(path.ward, { message: 'Ward is required' });
      disabled(path.ward, {
        when: () => this.wardOptions().length === 0,
      });
    }
    

    // City
    required(path.city, { message: 'City is required' });

    // Street
    required(path.street, { message: 'Street is required' });

    // Longitude
    if (path.longitude && path.latitude) {
      hidden(path.longitude, {
        when: () => true
      });

      // Latitude
      hidden(path.longitude, {
        when: () => true
      });
    }
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.userAddressForm().valid()) {
      return;
    }
    this.formSubmit.emit(toSubmitAddressRequest(this.userAddressModel()));
  }
}
