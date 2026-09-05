import { Injectable } from '@angular/core';
import states from './states.json';
import lgas from './lgas.json';
import { GeoLocationPort } from './geo-location.port';

@Injectable()
export class StaticGeoLocationAdapter implements GeoLocationPort {
  async getStates(): Promise<string[]> {
    return states as string[];
  }

  async getLocalGovernments(state: string): Promise<string[]> {
    return (lgas as Record<string, string[]>)[state] ?? [];
  }

  async getWards(_state: string, _localGovernment: string): Promise<string[]> {
    // TODO(backend): replace with a real call once the chunked
    // per-state/per-LGA wards endpoint exists (tracked separately).
    // Returning [] rather than throwing so the ward select renders an
    // empty/"no wards found" state instead of erroring.
    return [];
  }
}
