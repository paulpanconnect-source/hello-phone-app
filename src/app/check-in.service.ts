import { Injectable, signal } from '@angular/core';
import type { ConfirmationResult } from 'firebase/auth';
import { sendSmsCode } from './phone-auth';

export type CheckInRole = 'customer' | 'staff';

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
  readonly role = signal<CheckInRole>('customer');
  readonly draft = signal<CheckInGuest>({ ...EMPTY_GUEST });
  readonly guest = signal<CheckInGuest | null>(null);
  readonly confirmation = signal<ConfirmationResult | null>(null);

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
  }
}
