import { Component, inject, resource, signal } from '@angular/core';
import { GEO_LOCATION_PORT } from '../../data/geo/geo-location.port';
import { StaticGeoLocationAdapter } from '../../data/geo/static-geo-location.adapter';
import { SignupForm } from '../../ui/signup-form/signup-form.component';
import { RouterLink } from '@angular/router';
import { RegisterPayload } from '../../utils/models/auth.model';
import { AuthStore } from '../../data/auth-store/auth.store';

@Component({
  selector: 'app-signup-page',
  imports: [RouterLink, SignupForm],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css',
  providers: [{ provide: GEO_LOCATION_PORT, useClass: StaticGeoLocationAdapter }],
})
export class SignupPage {
  protected readonly authStore = inject(AuthStore);
  private readonly geoLocationSource = inject(GEO_LOCATION_PORT);

  protected readonly stateFieldActivated = signal(false);
  protected readonly selectedState = signal<string | undefined>(undefined);
  protected readonly selectedLocalGovernment = signal<string | undefined>(undefined);

  protected readonly statesResource = resource<string[], Record<string, never>>({
    params: () => (this.stateFieldActivated() ? {} : {}),
    loader: () => this.geoLocationSource.getStates(),
  });

  protected readonly localGovernmentsResource = resource<string[], { state: string }>({
    params: () => ({ state: this.selectedState() ?? '' }),
    loader: async ({ params }) => {
      if (!params.state) {
        return [];
      }
      return this.geoLocationSource.getLocalGovernments(params.state);
    },
  });

  protected readonly wardsResource = resource<string[], { state: string; localGovernment: string }>({
    params: () => ({
      state: this.selectedState() ?? '',
      localGovernment: this.selectedLocalGovernment() ?? '',
    }),
    loader: async ({ params }) => {
      if (!params.state || !params.localGovernment) {
        return [];
      }
      return this.geoLocationSource.getWards(params.state, params.localGovernment);
    },
  });

  protected onStateFieldFocused(): void {
    this.stateFieldActivated.set(true);
  }

  protected onStateSelected(state: string): void {
    this.selectedState.set(state);
    this.selectedLocalGovernment.set(undefined);
  }

  protected onLocalGovernmentSelected(localGovernment: string): void {
    this.selectedLocalGovernment.set(localGovernment);
  }
 
  protected onSignupSubmit(value: RegisterPayload): void {
    this.authStore.register(value)
  }
}
