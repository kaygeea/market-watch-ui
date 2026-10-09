import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSubmissionForm } from './address-submission-form.component';

describe('AddressSubmissionForm', () => {
  let component: AddressSubmissionForm;
  let fixture: ComponentFixture<AddressSubmissionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressSubmissionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressSubmissionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
