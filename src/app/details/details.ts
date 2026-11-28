import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInRole, CheckInService } from '../check-in.service';

@Component({
  selector: 'app-details',
  imports: [BrandHeader],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './details.html',
  host: { class: 'form-page' },
})
export class Details {
  private readonly checkIn = inject(CheckInService);
  private readonly router = inject(Router);
  private readonly initial = this.checkIn.draft();

  protected readonly role = signal<CheckInRole>(this.checkIn.role());
  protected readonly firstName = signal(this.initial.firstName);
  protected readonly lastName = signal(this.initial.lastName);
  protected readonly mobile = signal(formatMobile(this.initial.mobile));
  protected readonly email = signal(this.initial.email);
  protected readonly submitted = signal(false);
  protected readonly submitting = signal(false);
  protected readonly sendError = signal('');

  protected identityLocked(): boolean {
    return this.checkIn.lookup()?.status === 'partial';
  }

  protected nameOnRecord(): string {
    const lookup = this.checkIn.lookup();
    if (lookup?.status !== 'partial') {
      return '';
    }
    return `${lookup.firstNameOnRecord} ${lookup.lastNameOnRecord}`.trim();
  }

  protected helpText(): string {
    return this.role() === 'staff'
      ? 'Check in a customer on their behalf. We’ll text a code to their mobile number.'
      : 'Check yourself in. We’ll text a code to this mobile number.';
  }

  protected selectRole(role: CheckInRole): void {
    this.role.set(role);
    this.persist();
  }

  protected update(
    field: 'firstName' | 'lastName' | 'mobile' | 'email',
    value: string,
  ): void {
    this[field].set(field === 'mobile' ? formatMobile(value) : value);
    this.persist();
  }

  protected onMobile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const previous = this.mobile();
    const selection = input.selectionStart ?? input.value.length;
    let digitsBefore = input.value.slice(0, selection).replace(/\D/g, '').length;
    let digits = input.value.replace(/\D/g, '').slice(0, 10);
    const previousDigits = previous.replace(/\D/g, '');
    if (input.value.length < previous.length && digits.length === previousDigits.length) {
      const cut = Math.max(0, digitsBefore - 1);
      digits = (digits.slice(0, cut) + digits.slice(cut + 1)).slice(0, 10);
      digitsBefore = cut;
    }
    const formatted = formatMobile(digits);
    this.mobile.set(formatted);
    this.persist();
    input.value = formatted;
    const caret = caretAfterDigits(formatted, Math.min(digitsBefore, digits.length));
    input.setSelectionRange(caret, caret);
  }

  protected prefill(field: 'firstName' | 'lastName' | 'mobile' | 'email'): void {
    if (this[field]().trim()) {
      return;
    }
    const samples = {
      firstName: 'Jordan',
      lastName: 'Miller',
      mobile: '650-555-3434',
      email: 'j.miller@example.com',
    };
    this[field].set(samples[field]);
    this.persist();
  }

  protected errors(): { firstName: string; lastName: string; mobile: string; email: string } {
    const mobileDigits = this.mobile().replace(/\D/g, '');
    const email = this.email().trim();
    return {
      firstName: this.firstName().trim() ? '' : 'First name is required.',
      lastName: this.lastName().trim() ? '' : 'Last name is required.',
      mobile: mobileDigits.length === 10 ? '' : 'Enter a 10-digit mobile number.',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? ''
        : 'Enter a valid email address.',
    };
  }

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    this.submitted.set(true);
    const errors = this.errors();
    if (errors.firstName || errors.lastName || errors.mobile || errors.email) {
      return;
    }
    this.submitting.set(true);
    this.sendError.set('');
    try {
      await this.checkIn.sendCode(
        {
          firstName: this.firstName(),
          lastName: this.lastName(),
          mobile: this.mobile(),
          email: this.email(),
        },
        this.role(),
      );
      await this.router.navigateByUrl('/check-in/code');
    } catch {
      this.sendError.set("We couldn't text that number.");
    } finally {
      this.submitting.set(false);
    }
  }

  protected back(): void {
    this.persist();
    void this.router.navigateByUrl('/');
  }

  private persist(): void {
    this.checkIn.draft.set({
      firstName: this.firstName(),
      lastName: this.lastName(),
      mobile: this.mobile(),
      email: this.email(),
    });
    this.checkIn.role.set(this.role());
  }
}

function formatMobile(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  const area = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line = digits.slice(6, 10);
  if (digits.length <= 3) {
    return area;
  }
  if (digits.length <= 6) {
    return `${area}-${prefix}`;
  }
  return `${area}-${prefix}-${line}`;
}

function caretAfterDigits(formatted: string, digitCount: number): number {
  if (digitCount <= 0) {
    return 0;
  }
  let seen = 0;
  for (let index = 0; index < formatted.length; index++) {
    if (/\d/.test(formatted[index])) {
      seen += 1;
    }
    if (seen === digitCount) {
      return index + 1;
    }
  }
  return formatted.length;
}
