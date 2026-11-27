import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { CheckInService } from '../check-in.service';
import { Details } from './details';

describe('Details', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Details],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should not send a code when the form is invalid', () => {
    const fixture = TestBed.createComponent(Details);
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('First name is required.');
    expect(text).toContain('Enter a 10-digit mobile number.');
    expect(TestBed.inject(CheckInService).guest()).toBeNull();
  });

  it('should prefill a field when it is focused', () => {
    const fixture = TestBed.createComponent(Details);
    fixture.detectChanges();
    const firstName = fixture.nativeElement.querySelector(
      'input[name="firstName"]',
    ) as HTMLInputElement;
    firstName.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(firstName.value).toBe('Jordan');
  });

  it('should format the mobile number while typing', () => {
    const fixture = TestBed.createComponent(Details);
    fixture.detectChanges();
    const mobile = fixture.nativeElement.querySelector(
      'input[name="mobile"]',
    ) as HTMLInputElement;
    mobile.value = '6505553434';
    mobile.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(mobile.value).toBe('650-555-3434');
  });
});
