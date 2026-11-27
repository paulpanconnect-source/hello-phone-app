import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInService } from '../check-in.service';
import { AGREEMENT_POINTS, ShowroomService } from '../showroom.service';

@Component({
  selector: 'app-rewards',
  imports: [BrandHeader],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './rewards.html',
})
export class Rewards {
  private readonly checkIn = inject(CheckInService);
  private readonly router = inject(Router);
  protected readonly showroom = inject(ShowroomService);

  protected readonly guest = this.checkIn.guest;
  protected readonly account = this.checkIn.account;
  protected readonly share = this.checkIn.share;
  protected readonly bothAgreed = computed(
    () => this.account() === 'accepted' && this.share() === 'accepted',
  );

  constructor() {
    if (!this.guest()) {
      void this.router.navigateByUrl('/check-in');
    }
  }

  protected chooseAccount(accepted: boolean): void {
    if (this.account() !== 'open') {
      return;
    }
    this.checkIn.account.set(accepted ? 'accepted' : 'declined');
    if (accepted) {
      this.showroom.award(AGREEMENT_POINTS);
    }
  }

  protected chooseShare(accepted: boolean): void {
    if (this.account() === 'open' || this.share() !== 'open') {
      return;
    }
    this.checkIn.share.set(accepted ? 'accepted' : 'declined');
    if (accepted) {
      this.showroom.award(AGREEMENT_POINTS);
    }
  }

  protected points(value: number): string {
    return value.toLocaleString('en-US');
  }

  protected redeemPoints(): void {
    void this.router.navigateByUrl('/check-in/redeem');
  }

  protected browseVehicles(): void {
    void this.router.navigateByUrl('/check-in/browse');
  }
}
