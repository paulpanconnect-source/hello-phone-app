import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../app.routes';
import { CheckInService } from '../check-in.service';
import { ShowroomService } from '../showroom.service';
import { Browse } from './browse';
import { Results } from '../results/results';

describe('Browse', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Browse, Results],
      providers: [provideRouter(routes)],
    }).compileComponents();
    TestBed.inject(CheckInService).guest.set({
      firstName: 'Alex',
      lastName: 'Kim',
      mobile: '6505553434',
      email: 'alex@example.com',
    });
  });

  function choose(fixture: ReturnType<typeof TestBed.createComponent>, name: string, value: string) {
    const selects = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('select'),
    ];
    const target =
      name === 'brand' ? selects[0] : name === 'model' ? selects[1] : selects[2];
    target.value = value;
    target.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    return selects;
  }

  it('should limit models to the selected brand and open three matches', async () => {
    const fixture = TestBed.createComponent(Browse);
    fixture.detectChanges();
    const search = () =>
      [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')].find(
        (button) => button.textContent?.includes('Search'),
      ) as HTMLButtonElement;
    expect(search().disabled).toBe(true);

    choose(fixture, 'brand', 'Chevrolet');
    const modelOptions = [
      ...(fixture.nativeElement as HTMLElement).querySelectorAll('select'),
    ][1]
      .querySelectorAll('option');
    const names = [...modelOptions].map((option) => option.textContent?.trim());
    expect(names).toContain('Silverado');
    expect(names).not.toContain('Escalade');

    choose(fixture, 'model', 'Silverado');
    choose(fixture, 'trim', 'LT');
    expect(search().disabled).toBe(false);
    search().click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toContain('/check-in/browse/results');

    const results = TestBed.createComponent(Results);
    results.detectChanges();
    const text = (results.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('and 7 more meet search');
    expect(text).toContain('Connected to');
    expect(text).toContain('Retail Center');
    expect(text).toContain('Save Search');
    expect((results.nativeElement as HTMLElement).querySelectorAll('article').length).toBe(3);
    expect((results.nativeElement as HTMLElement).querySelectorAll('article img').length).toBe(3);

    const first = (results.nativeElement as HTMLElement).querySelector('article');
    first?.click();
    results.detectChanges();
    expect(first?.classList.contains('selected')).toBe(true);
    expect(first?.getAttribute('aria-pressed')).toBe('true');

    const save = [...(results.nativeElement as HTMLElement).querySelectorAll('button')].find(
      (button) => button.textContent?.includes('Save Search'),
    );
    save?.click();
    results.detectChanges();
    expect((results.nativeElement as HTMLElement).textContent).toContain('Search saved');

    const back = [...(results.nativeElement as HTMLElement).querySelectorAll('button')].find(
      (button) => button.textContent?.includes('Back'),
    );
    back?.click();
    await results.whenStable();
    expect(TestBed.inject(Router).url).toBe('/check-in/browse');
    expect(TestBed.inject(ShowroomService).brand()).toBe('Chevrolet');
    expect(TestBed.inject(ShowroomService).model()).toBe('Silverado');
    expect(TestBed.inject(ShowroomService).trim()).toBe('LT');

    const again = TestBed.createComponent(Browse);
    again.detectChanges();
    const restored = [...(again.nativeElement as HTMLElement).querySelectorAll('select')].map(
      (select) => (select as HTMLSelectElement).value,
    );
    expect(restored).toEqual(['Chevrolet', 'Silverado', 'LT']);
  });
});