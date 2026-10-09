import {
  Component,
  computed,
  DestroyRef,
  inject,
  InjectionToken,
  resource,
  signal,
  untracked,
} from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddressSubmissionForm } from '../../ui/address-submission-form/address-submission-form.component';
import { UserAddressService } from '../../data-access/api/user-address.service';
import { getApiServerError } from '../../../../../shared/data-access/api-error';
import {
  GetWardsResponse,
  NigeriaGeoJsonWard,
  SubmitAddressRequestPayload,
} from '../../data-access/api/address.api';
import {
  initialRequestState,
  RequestState,
  RequestStateEnum,
} from '../../../../../shared/data-access/interfaces/api.model';
import { IAddressSubmissionForm } from '../../ui/address-submission-form/address-submission-form.model';
import { FeatureMapperFn } from '../../../../../shared/features/feature-mapper.interface';
import { addressSubmissionMapper } from './address-submission.mapper';

export type AddressSubmissionMapperFn = FeatureMapperFn<
  IAddressSubmissionForm,
  SubmitAddressRequestPayload
>;
export const ADDRESS_SUBMISSION_MAPPER_TOKEN =
  new InjectionToken<AddressSubmissionMapperFn>(
    'address_submission.data_mapper_function', // Custom debug string label
  );

@Component({
  selector: 'app-address-submission',
  imports: [AddressSubmissionForm],
  templateUrl: './address-submission.component.html',
  styleUrl: './address-submission.component.css',
  providers: [
    {
      provide: ADDRESS_SUBMISSION_MAPPER_TOKEN,
      useValue: addressSubmissionMapper,
    },
  ],
})
export class AddressSubmission {
  private readonly mapper = inject(ADDRESS_SUBMISSION_MAPPER_TOKEN);
  protected readonly userAddressService = inject(UserAddressService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly submissionState = signal<RequestState>(initialRequestState);
  protected readonly isSubmitting = computed(
    () => this.submissionState().status === RequestStateEnum.PENDING,
  );
  protected readonly submissionSucceeded = computed(
    () => this.submissionState().status === RequestStateEnum.SUCCESS,
  );
  protected readonly serverError = computed(() => {
    const state = this.submissionState();
    if (state.status !== RequestStateEnum.ERROR) {
      return null;
    }

    const message = state.error?.message;
    if (typeof message === 'string') {
      return message;
    }
    if (message?.length) {
      return message.join('. ');
    }
    return 'We could not save this address. Please try again.';
  });

  // States properties
  protected readonly selectedState = signal<string>('');
  protected readonly stateFieldActivated = signal<boolean>(false);
  protected readonly statesResource = resource<string[], Record<string, never>>({
    params: () => (this.stateFieldActivated() ? {} : {}),
    loader: () => this.onStateFieldActivated(),
  });

  // Local government properties
  protected readonly selectedLocalGovernment = signal<string>('');
  protected readonly localGovernmentsResource = resource<string[], { state: string }>({
    params: () => ({ state: this.selectedState() }),
    loader: async ({ params }) => {
      if (params.state.length < 2) {
        return [];
      }
      return this.userAddressService.getLocalGovernments(params.state);
    },
  });

  // LG wards properties
  protected readonly selectedWard = signal<NigeriaGeoJsonWard | null>(null);
  protected readonly lgaWardsResource = rxResource<
    GetWardsResponse,
    { state: string; localGovernment: string } | undefined
  >({
    params: () => {
      // Changes to the state signal is untracked here to ensure API request is only made
      // when there is a valid state and local government pair.
      const state = untracked(() => this.selectedState());
      const localGovernment = this.selectedLocalGovernment();
      return state && localGovernment ? { state, localGovernment } : undefined;
    },
    stream: ({ params }) =>
      this.userAddressService.getWards(params.state, params.localGovernment),
    defaultValue: {
      success: true,
      statusCode: 200,
      message: '',
      data: {
        wardsCount: 0,
        state: '',
        localGovernment: '',
        wardsWithCoordinates: [],
      },
      timestamp: '',
    },
  });

  async onStateFieldActivated(): Promise<string[]> {
    return this.userAddressService.getStates();
  }

  onStateValueChanged(stateName: string) {
    this.selectedState.set(stateName);
    this.selectedLocalGovernment.set('');
    this.selectedWard.set(null);
  }

  onLocalGovernmentValueChanged(lgaName: string) {
    this.selectedLocalGovernment.set(lgaName);
    this.selectedWard.set(null);
  }

  onWardValueChanged(wardName: string) {
    const ward = this.lgaWardsResource
      .value()
      .data.wardsWithCoordinates.find(({ name }) => name === wardName);
    this.selectedWard.set(ward ?? null);
  }

  onAddressFormSubmit(value: IAddressSubmissionForm): void {
    if (this.isSubmitting()) {
      return;
    }

    this.submissionState.set({
      status: RequestStateEnum.PENDING,
      error: null,
    });

    const apiValue = this.mapper(value);
    this.userAddressService
      .submitAddress('01a12220-6db6-7250-b3ae-a72a00469e7f', apiValue)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submissionState.set({
            status: RequestStateEnum.SUCCESS,
            error: null,
          });
        },
        error: (error: unknown) => {
          this.submissionState.set({
            status: RequestStateEnum.ERROR,
            error: getApiServerError(error),
          });
        },
      });
  }
}
