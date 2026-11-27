import { Component, input } from '@angular/core';

@Component({
  selector: 'app-brand-header',
  styleUrls: ['../app.css', './brand-header.css'],
  templateUrl: './brand-header.html',
  host: {
    '[class.compact]': 'compact()',
  },
})
export class BrandHeader {
  readonly compact = input(false);
}
