import { Injectable, inject, signal } from '@angular/core';
import type { ConfirmationResult } from 'firebase/auth';
import { sendSmsCode } from './phone-auth';
import { ShowroomService } from './showroom.service';

export type CheckInRole = 'customer' | 'staff';
export type OfferChoice = 'open' | 'accepted' | 'declined';

export interface CheckInGuest {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
}

const EMPTY_GUEST: CheckInGuest = {
  firstName: '',
  lastName: '',
  mobile: '',
  email: '',
};

@Injectable({ providedIn: 'root' })
export class CheckInService {
  private readonly showroom = inject(ShowroomService);
  readonly role = signal<CheckInRole>('customer');
  readonly draft = signal<CheckInGuest>({ ...EMPTY_GUEST });
  readonly guest = signal<CheckInGuest | null>(null);
  readonly confirmation = signal<ConfirmationResult | null>(null);
  readonly account = signal<OfferChoice>('open');
  readonly share = signal<OfferChoice>('open');

  async sendCode(guest: CheckInGuest, role: CheckInRole): Promise<void> {
    const saved: CheckInGuest = {
      firstName: guest.firstName.trim(),
      lastName: guest.lastName.trim(),
      mobile: guest.mobile.replace(/\D/g, ''),
      email: guest.email.trim(),
    };
    const confirmation = await sendSmsCode('send-code', saved.mobile);
    this.draft.set(saved);
    this.role.set(role);
    this.guest.set(saved);
    this.confirmation.set(confirmation);
    this.account.set('open');
    this.share.set('open');
    this.showroom.resetVisit();
  }
}
