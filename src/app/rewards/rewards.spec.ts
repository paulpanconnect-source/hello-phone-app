import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { CheckInService } from '../check-in.service';
import { Rewards } from './rewards';

describe('Rewards', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rewards],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should confirm the GM account and unlock sharing', () => {
    TestBed.inject(CheckInService).guest.set({
      firstName: 'Alex',
      lastName: 'Kim',
      mobile: '5551234567',
      email: 'alex@example.com',
    });
    const fixture = TestBed.createComponent(Rewards);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(
      'Welcome Alex Kim for first time visit.',
    );

    const share = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Agree to share'),
    ) as HTMLButtonElement;
    expect(share.disabled).toBe(true);

    const agree = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Agree & create account'),
    );
    agree?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain(
      'GM account created and +1,500 points.',
    );
    const unlocked = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Agree to share'),
    ) as HTMLButtonElement;
    expect(unlocked.disabled).toBe(false);
    expect(compiled.textContent).not.toContain("You're all checked in!");

    unlocked.click();
    fixture.detectChanges();
    expect(compiled.textContent).toContain(
      'GM account created and +1,500 points.',
    );
    expect(compiled.textContent).toContain(
      'Shared with ABC Chevrolet Motors. +1,500 points.',
    );
    expect(compiled.textContent).toContain('checked in!');
    expect(compiled.textContent).toContain('Let us continue to serve you');
    expect(compiled.textContent).not.toContain("You're all checked in!");
    expect(compiled.textContent).not.toContain('so is the showroom');
    expect(compiled.textContent).toContain('Redeem');
    expect(compiled.textContent).toContain('Browse');
  });
});
