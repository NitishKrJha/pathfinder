import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopicsContentPage } from './topics-content';

@NgModule({
  declarations: [
    TopicsContentPage,
  ],
  imports: [
    IonicPageModule.forChild(TopicsContentPage),
  ],
})
export class TopicsContentPageModule {}
