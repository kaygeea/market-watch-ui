import { InjectionToken } from '@angular/core';

export interface GeoLocationPort {
  getStates(): Promise<string[]>;
  getLocalGovernments(state: string): Promise<string[]>;
  getWards(state: string, localGovernment: string): Promise<string[]>;
}

export const GEO_LOCATION_PORT = new InjectionToken<GeoLocationPort>('GeoLocationPort');
