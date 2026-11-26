import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrandHeader } from '../brand-header/brand-header';

@Component({
  selector: 'app-welcome',
  imports: [BrandHeader],
  styleUrls: ['../host.css', '../app.css'],
  templateUrl: './welcome.html',
})
export class Welcome {
  private readonly router = inject(Router);

  protected start(): void {
    void this.router.navigateByUrl('/check-in');
  }
}
