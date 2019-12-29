import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopicsListPage } from './topics-list';

@NgModule({
  declarations: [
    TopicsListPage,
  ],
  imports: [
    IonicPageModule.forChild(TopicsListPage),
  ],
})
export class TopicsListPageModule {}
