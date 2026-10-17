import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import {
  GetWardsResponse,
  SubmitAddressResponse,
} from '../../data-access/api/address.api';
import { UserAddressService } from '../../data-access/api/user-address.service';
import { IAddressSubmissionForm } from '../../ui/address-submission-form/address-submission-form.model';
import { AddressSubmission } from './address-submission.component';

describe('AddressSubmission', () => {
  let fixture: ComponentFixture<AddressSubmission>;
  let component: AddressSubmission;
  let submissionResponse: Subject<SubmitAddressResponse>;
  let wardsResponse: Subject<GetWardsResponse>;
  let submitAddress: ReturnType<typeof vi.fn>;

  const formValue: IAddressSubmissionForm = {
    label: 'Home',
    country: 'Nigeria',
    state: 'Federal Capital Territory',
    localGovernment: 'Gwagwalada',
    ward: 'Dobi',
    city: 'Gwagwalada',
    street: 'Main Street',
    zipCode: '',
    longitude: null,
    latitude: null,
  };

  beforeEach(async () => {
    submissionResponse = new Subject<SubmitAddressResponse>();
    wardsResponse = new Subject<GetWardsResponse>();
    submitAddress = vi.fn(() => submissionResponse.asObservable());

    await TestBed.configureTestingModule({
      imports: [AddressSubmission],
      providers: [
        {
          provide: UserAddressService,
          useValue: {
            submitAddress,
            getStates: () => [],
            getLocalGovernments: () => [],
            getWards: () => wardsResponse.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressSubmission);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('updates ward coordinate inputs whenever the selected ward changes', async () => {
    component.onStateValueChanged('Federal Capital Territory');
    component.onLocalGovernmentValueChanged('Gwagwalada');
    fixture.detectChanges();
    await fixture.whenStable();

    wardsResponse.next({
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: {
        wardsCount: 2,
        state: 'Federal Capital Territory',
        localGovernment: 'Gwagwalada',
        wardsWithCoordinates: [
          { name: 'Dobi', latitude: 8.948, longitude: 7.084 },
          { name: 'Zuba', latitude: 9.098, longitude: 7.206 },
        ],
      },
      timestamp: '2026-10-01T15:35:54.270Z',
    });
    fixture.detectChanges();

    const wardSelect = fixture.nativeElement.querySelector('#ward') as HTMLSelectElement;
    const longitudeInput = fixture.nativeElement.querySelector(
      '#longitude',
    ) as HTMLInputElement;
    const latitudeInput = fixture.nativeElement.querySelector(
      '#latitude',
    ) as HTMLInputElement;

    wardSelect.value = 'Dobi';
    wardSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(longitudeInput.value).toBe('7.084');
    expect(latitudeInput.value).toBe('8.948');

    wardSelect.value = 'Zuba';
    wardSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(longitudeInput.value).toBe('7.206');
    expect(latitudeInput.value).toBe('9.098');
  });

  it('subscribes to the address request and reflects its successful response', () => {
    component.onAddressFormSubmit(formValue);
    component.onAddressFormSubmit(formValue);
    fixture.detectChanges();

    expect(submitAddress).toHaveBeenCalledTimes(1);
    expect(submitAddress).toHaveBeenCalledWith('01a0f33c-520e-7000-b1e3-2fc14bcdee20', {
      label: 'Home',
      country: 'Nigeria',
      state: 'Federal Capital Territory',
      localGovernment: 'Gwagwalada',
      ward: 'Dobi',
      city: 'Gwagwalada',
      street: 'Main Street',
    });
    expect(fixture.nativeElement.textContent).toContain('Submitting…');

    submissionResponse.next({
      success: true,
      statusCode: 201,
      message: 'Address created',
      data: {
        id: 'address-1',
        newAddressCount: 1,
        withCoordinates: false,
        createdAt: '2026-10-01T00:00:00.000Z',
      },
      timestamp: '2026-10-01T00:00:00.000Z',
    });
    submissionResponse.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Address saved successfully.');
    expect(fixture.nativeElement.textContent).not.toContain('Submitting…');
  });

  it('shows the API error and allows the request to be retried', () => {
    component.onAddressFormSubmit(formValue);
    submissionResponse.error(
      new HttpErrorResponse({
        status: 400,
        error: {
          success: false,
          statusCode: 400,
          message: 'Address could not be saved',
          data: null,
          timestamp: '2026-10-01T00:00:00.000Z',
          error: { name: 'BadRequest' },
        },
      }),
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Address could not be saved');
    expect(fixture.nativeElement.textContent).not.toContain('Submitting…');

    submissionResponse = new Subject<SubmitAddressResponse>();
    submitAddress.mockReturnValueOnce(submissionResponse.asObservable());
    component.onAddressFormSubmit(formValue);

    expect(submitAddress).toHaveBeenCalledTimes(2);
  });

  it('cancels an in-flight request when the feature is destroyed', () => {
    component.onAddressFormSubmit(formValue);

    expect(submissionResponse.observers).toHaveLength(1);

    fixture.destroy();

    expect(submissionResponse.observers).toHaveLength(0);
  });
});
