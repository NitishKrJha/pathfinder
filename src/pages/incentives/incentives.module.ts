import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncentivesPage } from './incentives';
// import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    IncentivesPage
  ],
  imports: [
   // PdfViewerModule,
    IonicPageModule.forChild(IncentivesPage),
  ],
})
export class IncentivesPageModule {}
