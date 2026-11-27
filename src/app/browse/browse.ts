import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInService } from '../check-in.service';
import { RetailStatus } from '../retail-status/retail-status';
import { ShowroomService } from '../showroom.service';

@Component({
  selector: 'app-browse',
  imports: [BrandHeader, RetailStatus],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './browse.html',
})
export class Browse {
  private readonly checkIn = inject(CheckInService);
  private readonly router = inject(Router);
  protected readonly showroom = inject(ShowroomService);

  constructor() {
    if (!this.checkIn.guest()) {
      void this.router.navigateByUrl('/check-in');
    }
  }

  protected onBrand(event: Event): void {
    this.showroom.selectBrand((event.target as HTMLSelectElement).value);
  }

  protected onModel(event: Event): void {
    this.showroom.selectModel((event.target as HTMLSelectElement).value);
  }

  protected onTrim(event: Event): void {
    this.showroom.selectTrim((event.target as HTMLSelectElement).value);
  }

  protected canSearch(): boolean {
    return Boolean(this.showroom.brand() && this.showroom.model() && this.showroom.trim());
  }

  protected search(): void {
    if (!this.canSearch()) {
      return;
    }
    void this.router.navigateByUrl('/check-in/browse/results');
  }

  protected back(): void {
    void this.router.navigateByUrl('/check-in/rewards');
  }
}
