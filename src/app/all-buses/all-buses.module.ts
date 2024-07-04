import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllBusesPageRoutingModule } from './all-buses-routing.module';

import { AllBusesPage } from './all-buses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllBusesPageRoutingModule
  ],
  declarations: [AllBusesPage]
})
export class AllBusesPageModule {}
