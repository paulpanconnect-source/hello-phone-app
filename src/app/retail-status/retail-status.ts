import { Component, input } from '@angular/core';

@Component({
  selector: 'app-retail-status',
  styleUrl: './retail-status.css',
  templateUrl: './retail-status.html',
})
export class RetailStatus {
  readonly badge = input('RC');
  readonly partner = input('Retail Center');
}
