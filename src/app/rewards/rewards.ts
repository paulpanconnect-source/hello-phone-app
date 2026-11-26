import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInService } from '../check-in.service';

type OfferChoice = 'open' | 'accepted' | 'declined';

@Component({
  selector: 'app-rewards',
  imports: [BrandHeader],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './rewards.html',
})
export class Rewards {
  private readonly checkIn = inject(CheckInService);
  private readonly router = inject(Router);

  protected readonly guest = this.checkIn.guest;
  protected readonly account = signal<OfferChoice>('open');
  protected readonly share = signal<OfferChoice>('open');
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
    this.account.set(accepted ? 'accepted' : 'declined');
  }

  protected chooseShare(accepted: boolean): void {
    if (this.account() === 'open' || this.share() !== 'open') {
      return;
    }
    this.share.set(accepted ? 'accepted' : 'declined');
  }
}
