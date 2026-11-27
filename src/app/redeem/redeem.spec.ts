import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../app.routes';
import { CheckInService } from '../check-in.service';
import { ShowroomService } from '../showroom.service';
import { Redeem } from './redeem';
import { RedemptionCode } from './redemption-code';

describe('Redeem', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Redeem, RedemptionCode],
      providers: [provideRouter(routes)],
    }).compileComponents();
    TestBed.inject(CheckInService).guest.set({
      firstName: 'Alex',
      lastName: 'Kim',
      mobile: '6505553434',
      email: 'alex@example.com',
    });
    const showroom = TestBed.inject(ShowroomService);
    showroom.award(1500);
    showroom.award(1500);
  });

  it('should open a service code after the chosen reward is redeemed', async () => {
    const fixture = TestBed.createComponent(Redeem);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Balance: 3,000 points');
    expect(compiled.textContent).toContain('2,800 points');
    expect(compiled.textContent).toContain('1,900 points');
    expect(compiled.textContent).toContain('Connected to');
    expect(compiled.textContent).toContain('GM Rewards');

    const redeem = [...compiled.querySelectorAll('button')].find((button) =>
      button.textContent?.trim() === 'Redeem',
    ) as HTMLButtonElement;
    expect(redeem.disabled).toBe(true);

    const oil = [...compiled.querySelectorAll('section')][0] as HTMLElement;
    oil.click();
    fixture.detectChanges();
    expect(redeem.disabled).toBe(false);
    redeem.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toContain('/check-in/redeem/code');

    const code = TestBed.createComponent(RedemptionCode);
    code.detectChanges();
    const text = (code.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('K4M 8P2');
    expect(text).toContain('Connected to');
    expect(text).toContain('GM Rewards');
    expect(text).toContain('service department');
    expect(text).toContain('The redemption code sent to ••••3434.');
    expect(text).toContain('Points Redeemed');
    expect(text).toContain('-2,800');
    expect(text).toContain('Available Balance');
    expect(text).toContain('200');
  });
});
