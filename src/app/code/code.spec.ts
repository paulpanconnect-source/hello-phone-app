import { TestBed } from '@angular/core/testing';
import type { ConfirmationResult } from 'firebase/auth';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../app.routes';
import { CheckInService } from '../check-in.service';
import { Code } from './code';

describe('Code', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Code],
      providers: [provideRouter(routes)],
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

  it('should show a success message and hide Resend after the code matches', async () => {
    TestBed.inject(CheckInService).confirmation.set({
      confirm: () => Promise.resolve(undefined),
    } as unknown as ConfirmationResult);
    const fixture = enterCode();
    const compiled = fixture.nativeElement as HTMLElement;
    const confirm = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Confirm'),
    );
    confirm?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Verification Successful!');
    expect(compiled.textContent).toContain("We're thrilled to have you here!");
    expect(compiled.textContent).toContain('Continue & claim 3,000 points!');
    expect(compiled.textContent).not.toContain('Resend code');
    expect(TestBed.inject(Router).url).not.toContain('rewards');

    const next = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Continue'),
    );
    next?.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toContain('rewards');
  });
});
