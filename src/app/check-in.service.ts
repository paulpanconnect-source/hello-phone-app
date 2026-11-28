import { Injectable, inject, signal } from '@angular/core';
import type { ConfirmationResult } from 'firebase/auth';
import { sendSmsCode } from './phone-auth';
import { ShowroomService } from './showroom.service';

export type CheckInRole = 'customer' | 'staff';
export type OfferChoice = 'open' | 'accepted' | 'declined';

export type CheckInLookup =
  | { status: 'matched'; rewardPoints: number }
  | { status: 'partial'; firstNameOnRecord: string; lastNameOnRecord: string }
  | { status: 'missing' };

export type TesterPersona = 'new' | 'existing';

export const TESTER_GUESTS: Record<TesterPersona, CheckInGuest> = {
  new: {
    firstName: 'Jane',
    lastName: 'Doe',
    mobile: '650-555-0000',
    email: 'j.doe@example.com',
  },
  existing: {
    firstName: 'Jordan',
    lastName: 'Miller',
    mobile: '650-555-3434',
    email: 'j.miller@example.com',
  },
};

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
  readonly lookup = signal<CheckInLookup | null>(null);
  readonly tester = signal<TesterPersona>('new');

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
    this.lookup.set(null);
    this.showroom.resetVisit();
  }
}
