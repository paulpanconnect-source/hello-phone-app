import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
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
      mobile: '5551234567',
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

  it('should fill 482913 one digit at a time after any box is clicked', async () => {
    vi.useFakeTimers();
    TestBed.inject(CheckInService).guest.set({
      firstName: 'Alex',
      lastName: 'Kim',
      mobile: '5551234567',
      email: 'alex@example.com',
    });
    const fixture = TestBed.createComponent(Code);
    fixture.detectChanges();
    const inputs = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('input'),
    ];

    inputs[3].click();
    fixture.detectChanges();
    expect(inputs.map((input) => input.value).join('')).toBe('4');

    await vi.advanceTimersByTimeAsync(280);
    fixture.detectChanges();
    expect(inputs.map((input) => input.value).join('')).toBe('48');

    await vi.advanceTimersByTimeAsync(280 * 4);
    fixture.detectChanges();
    expect(inputs.map((input) => input.value).join('')).toBe('482913');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Confirm');
    vi.useRealTimers();
  });

  it('should show a verification message after Confirm', () => {
    const fixture = enterCode();
    const compiled = fixture.nativeElement as HTMLElement;
    const confirm = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Confirm'),
    );
    confirm?.click();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Verifying your code');
  });
});
