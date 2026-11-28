import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../app.routes';
import { CheckInService } from '../check-in.service';
import { Details } from '../details/details';
import { Welcome } from './welcome';

describe('Welcome', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Welcome, Details],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should prefill Jane Doe when a tester starts as a new customer', async () => {
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const start = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('New customer'),
    );
    start?.click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toContain('/check-in');
    const details = TestBed.createComponent(Details);
    details.detectChanges();
    const form = details.nativeElement as HTMLElement;
    expect((form.querySelector('input[name="firstName"]') as HTMLInputElement).value).toBe('Jane');
    expect((form.querySelector('input[name="lastName"]') as HTMLInputElement).value).toBe('Doe');
    expect((form.querySelector('input[name="mobile"]') as HTMLInputElement).value).toBe(
      '650-555-0000',
    );
    expect((form.querySelector('input[name="email"]') as HTMLInputElement).value).toBe(
      'j.doe@example.com',
    );
    expect(TestBed.inject(CheckInService).tester()).toBe('new');
    const newCustomer = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('New customer'),
    ) as HTMLButtonElement;
    expect(newCustomer.classList.contains('selected')).toBe(true);
  });

  it('should start check-in as the existing customer', async () => {
    const fixture = TestBed.createComponent(Welcome);
    fixture.detectChanges();
    const existing = [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')].find(
      (button) => button.textContent?.includes('Existing customer'),
    );
    existing?.click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toContain('/check-in');
    const details = TestBed.createComponent(Details);
    details.detectChanges();
    const form = details.nativeElement as HTMLElement;
    expect((form.querySelector('input[name="firstName"]') as HTMLInputElement).value).toBe(
      'Jordan',
    );
    expect((form.querySelector('input[name="mobile"]') as HTMLInputElement).value).toBe(
      '650-555-3434',
    );
  });
});
