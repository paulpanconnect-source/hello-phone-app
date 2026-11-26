import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';
import { CheckInService } from '../check-in.service';

const SAMPLE_CODE = '482913';

@Component({
  selector: 'app-code',
  imports: [BrandHeader],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './code.html',
})
export class Code implements OnDestroy {
  private readonly checkIn = inject(CheckInService);
  private readonly router = inject(Router);
  private readonly boxes = viewChildren<ElementRef<HTMLInputElement>>('box');
  private fillTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly guest = this.checkIn.guest;
  protected readonly role = this.checkIn.role;
  protected readonly digits = signal(['', '', '', '', '', '']);
  protected readonly verifying = signal(false);
  protected readonly filling = signal(false);

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

  ngOnDestroy(): void {
    this.stopSampleFill();
  }

  protected startSampleFill(): void {
    if (this.verifying() || this.filling() || this.codeReady()) {
      return;
    }
    this.filling.set(true);
    this.digits.set(['', '', '', '', '', '']);
    this.stepSample(0);
  }

  protected onInput(index: number, event: Event): void {
    if (this.filling()) {
      return;
    }
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
    this.verifying.set(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await this.router.navigateByUrl('/check-in/rewards');
  }

  protected resend(): void {
    if (this.verifying()) {
      return;
    }
    this.stopSampleFill();
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
    queueMicrotask(() => this.focusBox(Math.min(Math.max(chars.length, 1), 6) - 1));
  }

  private stepSample(index: number): void {
    this.digits.update((current) => {
      const next = [...current];
      next[index] = SAMPLE_CODE[index];
      return next;
    });
    queueMicrotask(() => this.focusBox(index));
    if (index < SAMPLE_CODE.length - 1) {
      this.fillTimer = setTimeout(() => this.stepSample(index + 1), 280);
      return;
    }
    this.filling.set(false);
    this.fillTimer = null;
  }

  private stopSampleFill(): void {
    if (this.fillTimer !== null) {
      clearTimeout(this.fillTimer);
      this.fillTimer = null;
    }
    this.filling.set(false);
  }

  private focusBox(index: number): void {
    this.boxes()[index]?.nativeElement.focus();
  }
}
