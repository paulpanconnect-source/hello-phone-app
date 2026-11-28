import { HttpClient } from '@angular/common/http';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInService } from '../check-in.service';
import { checkSmsCode } from '../phone-auth';
import { ShowroomService } from '../showroom.service';

export const VERIFY_CHECK_IN_URL =
  'https://us-central1-cust-check-in.cloudfunctions.net/verifyCheckIn';

interface VerifyCheckInResponse {
  totalValue: number;
  rewardPoints?: number | string;
  firstNameOnRecord?: string;
  lastNameOnRecord?: string;
}

@Component({
  selector: 'app-code',
  imports: [BrandHeader],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './code.html',
})
export class Code {
  private readonly checkIn = inject(CheckInService);
  private readonly showroom = inject(ShowroomService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  protected readonly guest = this.checkIn.guest;
  protected readonly role = this.checkIn.role;
  protected readonly digits = signal(['', '', '', '', '', '']);
  protected readonly verifying = signal(false);
  protected readonly lookingUp = signal(false);
  protected readonly verified = signal(false);
  protected readonly codeError = signal('');
  protected readonly profileError = signal('');

  constructor() {
    if (!this.guest()) {
      void this.router.navigateByUrl('/check-in');
      return;
    }
    afterNextRender(() => this.focusBox(0));
  }

  protected maskedMobile(): string {
    const digits = this.guest()?.mobile.replace(/\D/g, '') ?? '';
    return `••••${digits.slice(-4)}`;
  }

  protected onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '');
    if (raw.length > 1) {
      this.applyCode(raw);
      return;
    }
    const char = raw.slice(-1);
    this.digits.update((current) => {
      const next = [...current];
      next[index] = char;
      return next;
    });
    input.value = char;
    if (char && index < 5) {
      this.focusBox(index + 1);
    }
  }

  protected onKey(index: number, event: KeyboardEvent): void {
    if (event.key !== 'Backspace' || this.digits()[index] || index === 0) {
      return;
    }
    this.digits.update((current) => {
      const next = [...current];
      next[index - 1] = '';
      return next;
    });
    this.focusBox(index - 1);
  }

  protected onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    this.applyCode(text);
  }

  protected codeReady(): boolean {
    return this.digits().every((digit) => digit.length === 1);
  }

  protected async confirm(): Promise<void> {
    if (!this.codeReady() || this.verifying()) {
      return;
    }
    const confirmation = this.checkIn.confirmation();
    this.verifying.set(true);
    this.lookingUp.set(false);
    this.codeError.set('');
    this.profileError.set('');
    try {
      if (!confirmation) {
        throw new Error('Missing confirmation');
      }
      await checkSmsCode(confirmation, this.digits().join(''));
      this.lookingUp.set(true);
      await this.lookupProfile();
    } catch {
      if (this.lookingUp()) {
        this.profileError.set("We couldn't look up that profile.");
      } else {
        this.codeError.set("That code didn't match.");
      }
    } finally {
      this.verifying.set(false);
      this.lookingUp.set(false);
    }
  }

  protected rewardPoints(): string {
    const lookup = this.checkIn.lookup();
    const points = lookup?.status === 'matched' ? lookup.rewardPoints : 0;
    return points.toLocaleString('en-US');
  }

  protected continue(): void {
    void this.router.navigateByUrl('/check-in/rewards');
  }

  protected async resend(): Promise<void> {
    if (this.verifying()) {
      return;
    }
    const guest = this.guest();
    if (!guest) {
      return;
    }
    this.digits.set(['', '', '', '', '', '']);
    this.codeError.set('');
    try {
      await this.checkIn.sendCode(guest, this.role());
    } catch {
      this.codeError.set("We couldn't text that number.");
    }
    queueMicrotask(() => this.focusBox(0));
  }

  protected back(): void {
    void this.router.navigateByUrl('/check-in');
  }

  private async lookupProfile(): Promise<void> {
    const guest = this.guest();
    if (!guest) {
      return;
    }
    const body = await firstValueFrom(
      this.http.post<VerifyCheckInResponse>(VERIFY_CHECK_IN_URL, {
        firstName: guest.firstName,
        lastName: guest.lastName,
        phoneNumber: guest.mobile.replace(/\D/g, ''),
        email: guest.email,
      }),
    );
    if (body.totalValue === 5) {
      const rewardPoints = readRewardPoints(body.rewardPoints);
      this.checkIn.lookup.set({ status: 'matched', rewardPoints });
      this.checkIn.account.set('accepted');
      this.showroom.balance.set(rewardPoints);
      await this.router.navigateByUrl('/check-in/rewards');
      return;
    }
    if (body.totalValue === 4) {
      this.checkIn.lookup.set({
        status: 'partial',
        firstNameOnRecord: body.firstNameOnRecord ?? '',
        lastNameOnRecord: body.lastNameOnRecord ?? '',
      });
      await this.router.navigateByUrl('/check-in');
      return;
    }
    if (body.totalValue === 0) {
      this.checkIn.lookup.set({ status: 'missing' });
      await this.router.navigateByUrl('/check-in/rewards');
      return;
    }
    this.profileError.set("We couldn't look up that profile.");
  }

  private applyCode(value: string): void {
    const chars = value.replace(/\D/g, '').slice(0, 6);
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < chars.length; i++) {
      next[i] = chars[i];
    }
    this.digits.set(next);
    queueMicrotask(() => this.focusBox(Math.min(Math.max(chars.length, 1), 6) - 1));
  }

  private focusBox(index: number): void {
    this.boxes()[index]?.nativeElement.focus();
  }
}

function readRewardPoints(value: number | string | undefined): number {
  const points = typeof value === 'string' ? Number(value.replace(/,/g, '')) : Number(value);
  return Number.isFinite(points) ? points : 0;
}
