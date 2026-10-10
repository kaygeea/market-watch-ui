import { Component, effect, input, output, signal } from '@angular/core';
import { disabled, form, FormField, readonly, required } from '@angular/forms/signals';
import {
  IAddressSubmissionForm,
  IAddressWardOption,
} from './address-submission-form.model';

const EMPTY_USER_ADDRESS_FORM_VALUE: IAddressSubmissionForm = {
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

@Component({
  selector: 'app-address-submission-form',
  imports: [FormField],
  templateUrl: './address-submission-form.component.html',
  styleUrl: './address-submission-form.component.css',
})
export class AddressSubmissionForm {
  readonly submitting = input<boolean>(false);
  readonly serverError = input<string | null>(null);

  protected readonly userAddressModel = signal<IAddressSubmissionForm>({
    ...EMPTY_USER_ADDRESS_FORM_VALUE,
  });

  // State selection variables
  readonly stateFieldActivated = output();
  readonly statesLoading = input<boolean>(false);
  readonly stateOptions = input<string[]>([]);
  readonly stateValueChanged = output<string>();

  // Local government selection variables
  readonly localGovernmentsLoading = input<boolean>(false);
  readonly localGovernmentOptions = input<string[]>([]);
  readonly localGovernmentValueChanged = output<string>();

  // Ward selection variables
  readonly wardsLoading = input<boolean>(false);
  readonly wardOptions = input<IAddressWardOption[]>([]);
  readonly wardValueChanged = output<string>();

  // Coordinates selected from the ward
  readonly longitude = input<number | null>(null);
  readonly latitude = input<number | null>(null);

  readonly formSubmit = output<IAddressSubmissionForm>();

  constructor() {
    effect(() => {
      const longitude = this.longitude();
      const latitude = this.latitude();
      this.userAddressModel.update((value) => ({
        ...value,
        longitude,
        latitude,
      }));
    });
  }

  protected readonly userAddressForm = form(this.userAddressModel, (path) => {
    // Label
    required(path.label, { message: 'Label is required' });

    // Country
    readonly(path.country);
    required(path.country, { message: 'Country is required' });

    // State
    required(path.state, { message: 'State is required' });
    disabled(path.state, {
      when: () => this.userAddressForm.country().value().length === 0,
    });

    // Local government
    required(path.localGovernment, { message: 'Local government is required' });
    disabled(path.localGovernment, {
      when: () => this.localGovernmentOptions()?.length === 0,
    });

    // Ward
    if (path.ward) {
      required(path.ward, { message: 'Ward is required' });
      disabled(path.ward, {
        when: () => this.wardOptions()?.length === 0,
      });
    }

    // City
    required(path.city, { message: 'City is required' });

    // Street
    required(path.street, { message: 'Street is required' });

    readonly(path.longitude);
    readonly(path.latitude);
  });

  protected onStateChange(event: Event): void {
    event.preventDefault();
    const selectElement = event.target as HTMLSelectElement;
    this.userAddressModel.update((value) => ({
      ...value,
      localGovernment: '',
      ward: '',
      longitude: null,
      latitude: null,
    }));
    this.stateValueChanged.emit(selectElement.value);
  }

  protected onLocalGovernmentChange(event: Event): void {
    event.preventDefault();
    const selectElement = event.target as HTMLSelectElement;
    this.userAddressModel.update((value) => ({
      ...value,
      ward: '',
      longitude: null,
      latitude: null,
    }));
    this.localGovernmentValueChanged.emit(selectElement.value);
  }

  protected onWardChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.wardValueChanged.emit(selectElement.value);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.userAddressForm().valid()) {
      return;
    }
    this.formSubmit.emit(this.userAddressModel());
  }
}
