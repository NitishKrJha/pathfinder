import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ToolOnePage } from './tool-one';

@NgModule({
  declarations: [
    ToolOnePage,
  ],
  imports: [
    IonicPageModule.forChild(ToolOnePage),
  ],
})
export class ToolOnePageModule {}
