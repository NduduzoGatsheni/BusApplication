import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllBusesPage } from './all-buses.page';

const routes: Routes = [
  {
    path: '',
    component: AllBusesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllBusesPageRoutingModule {}
