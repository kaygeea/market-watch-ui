import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../../../environments/environment';
import { GetWardsResponse, userAddressEndpoints } from './address.api';
import { UserAddressService } from './user-address.service';

describe('UserAddressService', () => {
  let service: UserAddressService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserAddressService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns the complete wards API response envelope', () => {
    const wards: GetWardsResponse['data'] = {
      wardsCount: 2,
      state: 'Federal Capital Territory',
      localGovernment: 'Gwagwalada',
      wardsWithCoordinates: [
        { name: 'Dobi', latitude: 8.948, longitude: 7.084 },
        { name: 'Zuba', latitude: 9.098, longitude: 7.206 },
      ],
    };
    const response: GetWardsResponse = {
      success: true,
      statusCode: 200,
      message: 'Request successful',
      data: wards,
      timestamp: '2026-10-01T15:35:54.270Z',
    };
    let result: GetWardsResponse | undefined;

    service.getWards('Federal Capital Territory', 'Gwagwalada').subscribe((value) => {
      result = value;
    });

    const request = httpTestingController.expectOne(
      `${environment.apiBaseUrl}${userAddressEndpoints.getWards(
        'Federal Capital Territory',
        'Gwagwalada',
      )}`,
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);

    expect(result).toEqual(response);
  });
});
