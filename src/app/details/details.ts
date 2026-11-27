import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInRole, CheckInService } from '../check-in.service';

@Component({
  selector: 'app-details',
  imports: [BrandHeader],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './details.html',
})
export class Details {
  private readonly checkIn = inject(CheckInService);
  private readonly router = inject(Router);
  private readonly initial = this.checkIn.draft();

  protected readonly role = signal<CheckInRole>(this.checkIn.role());
  protected readonly firstName = signal(this.initial.firstName);
  protected readonly lastName = signal(this.initial.lastName);
  protected readonly mobile = signal(this.initial.mobile);
  protected readonly email = signal(this.initial.email);
  protected readonly submitted = signal(false);
  protected readonly submitting = signal(false);
  protected readonly sendError = signal('');

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
    this[field].set(value);
    this.persist();
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
