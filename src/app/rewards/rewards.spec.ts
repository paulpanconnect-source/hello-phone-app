import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../app.routes';
import { CheckInService } from '../check-in.service';
import { ShowroomService } from '../showroom.service';
import { Rewards } from './rewards';

describe('Rewards', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rewards],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should confirm the GM account and unlock sharing', async () => {
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
      button.textContent?.includes('Agree and Earn 1,500 points'),
    ) as HTMLButtonElement;
    expect(share.disabled).toBe(true);

    const agree = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Agree & create account'),
    );
    agree?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Your GM Rewards profile is ready');
    expect(compiled.textContent).toContain('Points Earned:');
    expect(compiled.textContent).toContain('1,500 points');
    const unlocked = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Agree and Earn 1,500 points'),
    ) as HTMLButtonElement;
    expect(unlocked.disabled).toBe(false);
    expect(compiled.textContent).not.toContain("You're all checked in!");

    unlocked.click();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('Your GM Rewards profile is ready');
    expect(compiled.textContent).toContain(
      'Shared with ABC Chevrolet Motors. +1,500 points.',
    );
    expect(compiled.textContent).toContain('checked in!');
    expect(compiled.textContent).toContain('points · 3,000 pts');
    expect(compiled.textContent).toContain('Let us continue to serve you');
    expect(compiled.textContent).not.toContain("You're all checked in!");
    expect(compiled.textContent).not.toContain('so is the showroom');
    expect(compiled.textContent).toContain('Redeem');
    expect(compiled.textContent).toContain('Browse');
    const browse = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Browse'),
    ) as HTMLButtonElement;
    expect(browse.classList.contains('floor')).toBe(true);
    expect(getComputedStyle(browse).backgroundColor).toBe('rgb(212, 180, 131)');

    const redeem = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Redeem'),
    );
    redeem?.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toContain('/check-in/redeem');
  });

  it('should show a found customer as already enrolled and award only the share points', () => {
    const checkIn = TestBed.inject(CheckInService);
    checkIn.guest.set({
      firstName: 'Jordan',
      lastName: 'Miller',
      mobile: '6505553434',
      email: 'j.miller@example.com',
    });
    checkIn.lookup.set({ status: 'matched', rewardPoints: 5500 });
    checkIn.account.set('accepted');
    TestBed.inject(ShowroomService).balance.set(5500);
    const fixture = TestBed.createComponent(Rewards);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Welcome back, Jordan Miller.');
    expect(compiled.textContent).toContain('Already a GM Rewards customer.');
    expect(compiled.textContent).toContain('Current points balance');
    expect(compiled.textContent).toContain('5,500 points');
    expect(compiled.textContent).toContain('Today’s visit earns:');
    expect(compiled.textContent).toContain('+1,500 points');
    expect(compiled.textContent).toContain('Skip for now');
    expect(compiled.textContent).not.toContain('Agree & create account');

    const share = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Agree and Earn 1,500 points'),
    ) as HTMLButtonElement;
    expect(share.disabled).toBe(false);
    share.click();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('points · 7,000 pts');
  });

  it('should show both point agreements when no profile is found', () => {
    const checkIn = TestBed.inject(CheckInService);
    checkIn.guest.set({
      firstName: 'Alex',
      lastName: 'Kim',
      mobile: '5551234567',
      email: 'alex@example.com',
    });
    checkIn.lookup.set({ status: 'missing' });
    const fixture = TestBed.createComponent(Rewards);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('New here? Claim 3,000 bonus points');
    expect(compiled.textContent).toContain('No profile found yet.');
    expect(compiled.textContent).toContain('Create your GM account, earn 1,500 points.');
    expect(compiled.textContent).toContain('Today’s visit earns:');
    expect(compiled.textContent).toContain('+1,500 points');

    const agree = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Agree & create account'),
    ) as HTMLButtonElement;
    agree.click();
    fixture.detectChanges();
    const share = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Agree and Earn 1,500 points'),
    ) as HTMLButtonElement;
    expect(share.disabled).toBe(false);
    share.click();
    fixture.detectChanges();
    expect(compiled.textContent).toContain('points · 3,000 pts');
    expect(TestBed.inject(ShowroomService).balance()).toBe(3000);
  });
});
