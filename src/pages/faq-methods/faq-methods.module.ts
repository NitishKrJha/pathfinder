import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaqMethodsPage } from './faq-methods';

@NgModule({
  declarations: [
    FaqMethodsPage,
  ],
  imports: [
    IonicPageModule.forChild(FaqMethodsPage),
  ],
})
export class FaqMethodsPageModule {}
