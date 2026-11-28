import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the welcome screen with Start Check-in', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome to ABC Chevrolet',
    );
    expect(compiled.textContent).toContain('Start Check-in');
    expect(compiled.textContent).toContain('For Tester');
    expect(compiled.textContent).toContain('New customer');
    expect(compiled.textContent).toContain('Existing customer');
    expect(compiled.textContent).not.toContain('Agreed to connect');
  });
});
