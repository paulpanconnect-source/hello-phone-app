import { Routes } from '@angular/router';
import { Code } from './code/code';
import { Details } from './details/details';
import { Welcome } from './welcome/welcome';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'check-in', component: Details },
  { path: 'check-in/code', component: Code },
];
