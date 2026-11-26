import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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

  it('should check in when a 6-digit code is entered', () => {
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

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      "You're checked in, Alex",
    );
  });
});
