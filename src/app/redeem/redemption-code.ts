import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInService } from '../check-in.service';
import { RetailStatus } from '../retail-status/retail-status';
import { ShowroomService } from '../showroom.service';

@Component({
  selector: 'app-redemption-code',
  imports: [BrandHeader, RetailStatus],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './redemption-code.html',
})
export class RedemptionCode {
  private readonly checkIn = inject(CheckInService);
  private readonly router = inject(Router);
  protected readonly showroom = inject(ShowroomService);

  constructor() {
    if (!this.checkIn.guest()) {
      void this.router.navigateByUrl('/check-in');
      return;
    }
    if (!this.showroom.redemption()) {
      void this.router.navigateByUrl('/check-in/redeem');
    }
  }

  protected offerName(): string {
    const id = this.showroom.redemption()?.id;
    return this.showroom.offers.find((offer) => offer.id === id)?.name ?? 'service';
  }

  protected code(): string {
    const value = this.showroom.redemption()?.code ?? '';
    return value.replace(/(.{3})(.{3})/, '$1 $2');
  }

  protected phoneEnding(): string {
    const digits = this.checkIn.guest()?.mobile.replace(/\D/g, '') ?? '';
    return digits.slice(-4);
  }

  protected points(value: number): string {
    return value.toLocaleString('en-US');
  }

  protected back(): void {
    void this.router.navigateByUrl('/check-in/redeem');
  }
}
