import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInService } from '../check-in.service';
import { VehicleListing } from '../gm-inventory';
import { RetailStatus } from '../retail-status/retail-status';
import { ShowroomService } from '../showroom.service';

@Component({
  selector: 'app-results',
  imports: [BrandHeader, RetailStatus],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './results.html',
})
export class Results {
  private readonly checkIn = inject(CheckInService);
  private readonly router = inject(Router);
  protected readonly showroom = inject(ShowroomService);

  constructor() {
    if (!this.checkIn.guest()) {
      void this.router.navigateByUrl('/check-in');
      return;
    }
    if (!this.showroom.brand() || !this.showroom.model() || !this.showroom.trim()) {
      void this.router.navigateByUrl('/check-in/browse');
    }
  }

  protected select(listing: VehicleListing): void {
    this.showroom.selectVehicle(listing.id);
  }

  protected saveSearch(): void {
    this.showroom.saveSearch();
  }

  protected testDrive(): void {
    this.showroom.requestTestDrive();
  }

  protected back(): void {
    void this.router.navigateByUrl('/check-in/browse');
  }
}
