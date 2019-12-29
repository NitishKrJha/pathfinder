import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuizCategoryPage } from './quiz-category';

@NgModule({
  declarations: [
    QuizCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(QuizCategoryPage),
  ],
})
export class QuizCategoryPageModule {}
