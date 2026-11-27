import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInService } from '../check-in.service';
import { RetailStatus } from '../retail-status/retail-status';
import { RewardOffer, ShowroomService } from '../showroom.service';

@Component({
  selector: 'app-redeem',
  imports: [BrandHeader, RetailStatus],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './redeem.html',
})
export class Redeem {
  private readonly checkIn = inject(CheckInService);
  private readonly router = inject(Router);
  protected readonly showroom = inject(ShowroomService);

  constructor() {
    if (!this.checkIn.guest()) {
      void this.router.navigateByUrl('/check-in');
    }
  }

  protected points(value: number): string {
    return value.toLocaleString('en-US');
  }

  protected redeemed(id: string): boolean {
    return this.showroom.redeemed().includes(id);
  }

  protected select(offer: RewardOffer): void {
    this.showroom.selectReward(offer.id);
  }

  protected redeem(): void {
    const id = this.showroom.rewardId();
    if (!id || !this.showroom.redeem(id)) {
      return;
    }
    void this.router.navigateByUrl('/check-in/redeem/code');
  }

  protected back(): void {
    void this.router.navigateByUrl('/check-in/rewards');
  }
}
