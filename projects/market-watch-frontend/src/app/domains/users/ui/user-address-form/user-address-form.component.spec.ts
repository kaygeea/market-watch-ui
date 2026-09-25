import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddressForm } from './user-address-form.component';

describe('UserAddressForm', () => {
  let component: UserAddressForm;
  let fixture: ComponentFixture<UserAddressForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddressForm],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAddressForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
