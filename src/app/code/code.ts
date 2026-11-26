import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInService } from '../check-in.service';

@Component({
  selector: 'app-code',
  imports: [BrandHeader],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './code.html',
})
export class Code {
  private readonly checkIn = inject(CheckInService);
  private readonly router = inject(Router);
  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');

  protected readonly guest = this.checkIn.guest;
  protected readonly role = this.checkIn.role;
  protected readonly digits = signal(['', '', '', '', '', '']);
  protected readonly checkedIn = signal(false);

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
    this.finishIfComplete();
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

  protected resend(): void {
    this.checkedIn.set(false);
    this.digits.set(['', '', '', '', '', '']);
    queueMicrotask(() => this.focusBox(0));
  }

  protected back(): void {
    void this.router.navigateByUrl('/check-in');
  }

  private applyCode(value: string): void {
    const chars = value.replace(/\D/g, '').slice(0, 6);
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < chars.length; i++) {
      next[i] = chars[i];
    }
    this.digits.set(next);
    queueMicrotask(() => this.focusBox(Math.min(chars.length, 5)));
    this.finishIfComplete();
  }

  private finishIfComplete(): void {
    if (this.digits().every((digit) => digit.length === 1)) {
      this.checkedIn.set(true);
    }
  }

  private focusBox(index: number): void {
    this.boxes()[index]?.nativeElement.focus();
  }
}
