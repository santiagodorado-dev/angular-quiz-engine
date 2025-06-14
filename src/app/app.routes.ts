import { Routes } from '@angular/router';
import { CategorySelectorComponent } from './features/quiz/components/category-selector.component';
import { QuizQuestionComponent } from './features/quiz/components/quiz-question.component';
import { QuizResultsComponent } from './features/quiz/components/quiz-results.component';

export const routes: Routes = [
  { path: '', component: CategorySelectorComponent },
  { path: 'quiz', component: QuizQuestionComponent },
  { path: 'results', component: QuizResultsComponent },
  { path: '**', redirectTo: '' }
];
