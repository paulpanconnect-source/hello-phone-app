import { Injectable, computed, signal } from '@angular/core';
import { GM_BRANDS, GM_LISTINGS } from './gm-inventory';

export interface RewardOffer {
  id: string;
  name: string;
  cost: number;
}

export const REWARD_OFFERS: RewardOffer[] = [
  { id: 'oil-change', name: 'Oil change service', cost: 2800 },
  { id: 'ev-tires', name: 'EV tires rotation', cost: 1900 },
];

export const AGREEMENT_POINTS = 1500;

@Injectable({ providedIn: 'root' })
export class ShowroomService {
  readonly balance = signal(0);
  readonly redeemed = signal<string[]>([]);
  readonly brand = signal('Chevrolet');
  readonly model = signal('');
  readonly trim = signal('');
  readonly selectedId = signal('');
  readonly searchSaved = signal(false);
  readonly testDrives = signal<string[]>([]);
  readonly rewardId = signal('');
  readonly redemption = signal<{ id: string; code: string; burned: number } | null>(null);

  readonly brands = GM_BRANDS;
  readonly offers = REWARD_OFFERS;

  readonly models = computed(() => {
    return this.brands.find((brand) => brand.name === this.brand())?.models ?? [];
  });

  readonly trims = computed(() => {
    return this.models().find((model) => model.name === this.model())?.trims ?? [];
  });

  readonly matches = computed(() => {
    const brand = this.brand();
    const model = this.model();
    const trim = this.trim();
    if (!brand || !model || !trim) {
      return [];
    }
    return GM_LISTINGS.filter((listing) => {
      if (listing.brand !== brand || listing.model !== model) {
        return false;
      }
      if (brand === 'Chevrolet' && model === 'Equinox') {
        return true;
      }
      return listing.trim === trim;
    });
  });

  readonly topMatches = computed(() => this.matches().slice(0, 3));

  readonly moreCount = computed(() => Math.max(0, this.matches().length - 3));

  selectBrand(brand: string): void {
    this.brand.set(brand);
    this.model.set('');
    this.trim.set('');
    this.clearSearchState();
  }

  selectModel(model: string): void {
    this.model.set(model);
    this.trim.set('');
    this.clearSearchState();
  }

  selectTrim(trim: string): void {
    this.trim.set(trim);
    this.clearSearchState();
  }

  selectVehicle(id: string): void {
    this.selectedId.set(this.selectedId() === id ? '' : id);
  }

  selectReward(id: string): void {
    if (this.redeemed().includes(id)) {
      return;
    }
    this.rewardId.set(this.rewardId() === id ? '' : id);
  }

  award(points: number): void {
    this.balance.update((current) => current + points);
  }

  resetVisit(): void {
    this.balance.set(0);
    this.redeemed.set([]);
    this.rewardId.set('');
    this.redemption.set(null);
  }

  redeem(id: string): boolean {
    const offer = this.offers.find((item) => item.id === id);
    if (!offer || this.redeemed().includes(id) || this.balance() < offer.cost) {
      return false;
    }
    const code = SERVICE_CODES[id] ?? '000000';
    this.balance.update((points) => points - offer.cost);
    this.redeemed.update((ids) => [...ids, id]);
    this.rewardId.set('');
    this.redemption.set({ id, code, burned: offer.cost });
    return true;
  }

  saveSearch(): void {
    if (!this.brand() || !this.model() || !this.trim() || this.searchSaved()) {
      return;
    }
    this.searchSaved.set(true);
  }

  requestTestDrive(): void {
    const id = this.selectedId();
    if (!id || this.testDrives().includes(id)) {
      return;
    }
    this.testDrives.update((ids) => [...ids, id]);
  }

  testDriveRequested(): boolean {
    const id = this.selectedId();
    return Boolean(id) && this.testDrives().includes(id);
  }

  private clearSearchState(): void {
    this.selectedId.set('');
    this.searchSaved.set(false);
  }
}

const SERVICE_CODES: Record<string, string> = {
  'oil-change': 'K4M8P2',
  'ev-tires': 'R7C3W9',
};
