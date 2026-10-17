import { Component, input } from '@angular/core';

@Component({
  selector: 'app-landing-section',
  imports: [],
  templateUrl: './landing-section.component.html',
  styleUrl: './landing-section.component.css',
})
export class LandingSection {
  protected readonly sectionHeader = input<string>('');
  protected readonly sectionSubHeader = input<string | null>(null);
  protected readonly sectionBody = input<string | null>(null);
  protected readonly sectionCtaUrl = input<string | null>(null);
  protected readonly sectionCtaUrlText = input<string | null>(null);
}
