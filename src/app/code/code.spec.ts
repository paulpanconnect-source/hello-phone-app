import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ConfirmationResult } from 'firebase/auth';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../app.routes';
import { CheckInService } from '../check-in.service';
import { Details } from '../details/details';
import { ShowroomService } from '../showroom.service';
import { Code, VERIFY_CHECK_IN_URL } from './code';

describe('Code', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Code, Details],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  function enterCode() {
    TestBed.inject(CheckInService).guest.set({
      firstName: 'Alex',
      lastName: 'Kim',
      mobile: '6505553434',
      email: 'alex@example.com',
    });
    const fixture = TestBed.createComponent(Code);
    fixture.detectChanges();
    const inputs = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('input'),
    ];
    inputs.forEach((input, index) => {
      input.value = String(index + 1);
      input.dispatchEvent(new Event('input'));
    });
    fixture.detectChanges();
    return fixture;
  }

  async function confirmAndFlush(
    fixture: ComponentFixture<Code>,
    body: Record<string, string | number>,
  ): Promise<void> {
    const confirm = [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')].find(
      (button) => button.textContent?.includes('Confirm'),
    );
    confirm?.click();
    await Promise.resolve();
    await Promise.resolve();
    const request = TestBed.inject(HttpTestingController).expectOne(VERIFY_CHECK_IN_URL);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      firstName: 'Alex',
      lastName: 'Kim',
      phoneNumber: '6505553434',
      email: 'alex@example.com',
    });
    request.flush(body);
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('should show Confirm and stay on the code screen', () => {
    const compiled = enterCode().nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Confirm');
    expect(compiled.textContent).not.toContain("You're checked in");
    expect(TestBed.inject(Router).url).not.toContain('rewards');
  });

  it('should show a verification message after Confirm', () => {
    TestBed.inject(CheckInService).confirmation.set({
      confirm: () => new Promise(() => undefined),
    } as unknown as ConfirmationResult);
    const fixture = enterCode();
    const compiled = fixture.nativeElement as HTMLElement;
    const confirm = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Confirm'),
    );
    confirm?.click();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Verifying your code');
  });

  it('should stay on the page when the code does not match', async () => {
    TestBed.inject(CheckInService).confirmation.set({
      confirm: () => Promise.reject(new Error('bad code')),
    } as unknown as ConfirmationResult);
    const fixture = enterCode();
    const compiled = fixture.nativeElement as HTMLElement;
    const confirm = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Confirm'),
    );
    confirm?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(compiled.textContent).toContain("That code didn't match.");
    expect(TestBed.inject(Router).url).not.toContain('rewards');
  });

  it('should route a found customer to the rewards page', async () => {
    TestBed.inject(CheckInService).confirmation.set({
      confirm: () => Promise.resolve(undefined),
    } as unknown as ConfirmationResult);
    const fixture = enterCode();
    await confirmAndFlush(fixture, { totalValue: 5, rewardPoints: 4200 });
    expect(TestBed.inject(Router).url).toContain('/check-in/rewards');
    expect(TestBed.inject(ShowroomService).balance()).toBe(4200);
    expect(TestBed.inject(CheckInService).account()).toBe('accepted');
    expect(TestBed.inject(CheckInService).lookup()).toEqual({
      status: 'matched',
      rewardPoints: 4200,
    });
  });

  it('should return to the form and lock phone and email when the name differs', async () => {
    TestBed.inject(CheckInService).confirmation.set({
      confirm: () => Promise.resolve(undefined),
    } as unknown as ConfirmationResult);
    const fixture = enterCode();
    await confirmAndFlush(fixture, {
      totalValue: 4,
      firstNameOnRecord: 'Pat',
      lastNameOnRecord: 'Lee',
    });
    expect(TestBed.inject(Router).url).toBe('/check-in');

    const details = TestBed.createComponent(Details);
    details.detectChanges();
    const form = details.nativeElement as HTMLElement;
    const mobile = form.querySelector('input[name="mobile"]') as HTMLInputElement;
    const email = form.querySelector('input[name="email"]') as HTMLInputElement;
    const firstName = form.querySelector('input[name="firstName"]') as HTMLInputElement;
    expect(mobile.disabled).toBe(true);
    expect(email.disabled).toBe(true);
    expect(firstName.disabled).toBe(false);
    expect(form.textContent).toContain('Our system found your name is Pat Lee.');
  });

  it('should open the welcome bonus when no profile is found', async () => {
    TestBed.inject(CheckInService).confirmation.set({
      confirm: () => Promise.resolve(undefined),
    } as unknown as ConfirmationResult);
    const fixture = enterCode();
    await confirmAndFlush(fixture, { totalValue: 0 });
    expect(TestBed.inject(Router).url).toContain('/check-in/rewards');
    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain(
      'User profile not found.',
    );
  });
});
