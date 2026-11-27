import { Routes } from '@angular/router';
import { Browse } from './browse/browse';
import { Code } from './code/code';
import { Details } from './details/details';
import { Redeem } from './redeem/redeem';
import { RedemptionCode } from './redeem/redemption-code';
import { Results } from './results/results';
import { Rewards } from './rewards/rewards';
import { Welcome } from './welcome/welcome';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'check-in', component: Details },
  { path: 'check-in/code', component: Code },
  { path: 'check-in/rewards', component: Rewards },
  { path: 'check-in/redeem', component: Redeem },
  { path: 'check-in/redeem/code', component: RedemptionCode },
  { path: 'check-in/browse', component: Browse },
  { path: 'check-in/browse/results', component: Results },
];
