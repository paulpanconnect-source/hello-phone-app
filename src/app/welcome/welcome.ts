import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInService, TESTER_GUESTS, TesterPersona } from '../check-in.service';

@Component({
  selector: 'app-welcome',
  imports: [BrandHeader],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './welcome.html',
})
export class Welcome {
  private readonly checkIn = inject(CheckInService);
  private readonly router = inject(Router);

  protected readonly tester = this.checkIn.tester;

  protected choose(persona: TesterPersona): void {
    this.checkIn.tester.set(persona);
  }

  protected startAs(persona: TesterPersona): void {
    this.choose(persona);
    this.start();
  }

  protected start(): void {
    this.checkIn.draft.set({ ...TESTER_GUESTS[this.tester()] });
    void this.router.navigateByUrl('/check-in');
  }
}
