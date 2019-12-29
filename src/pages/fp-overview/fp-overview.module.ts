import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FpOverviewPage } from './fp-overview';

@NgModule({
  declarations: [
    FpOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(FpOverviewPage),
  ],
})
export class FpOverviewPageModule {}
