import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { QuizResult } from '../../../models/quiz.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss']
})
export class QuizResultsComponent implements OnInit, OnDestroy {
  result: QuizResult | null = null;
  private stateSubscription: Subscription | null = null;

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit() {
    this.stateSubscription = this.quizService.getQuizState().subscribe(state => {
      if (!state.category || !state.questions.length) {
        this.router.navigate(['/']);
        return;
      }

      this.result = this.quizService.calculateResult(state.questions);
    });
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  getScoreClass(): string {
    if (!this.result) return '';
    
    if (this.result.score >= 90) return 'excellent';
    if (this.result.score >= 70) return 'good';
    if (this.result.score >= 50) return 'average';
    return 'poor';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  retryQuiz() {
    // Reiniciar el quiz con la misma categoría
    if (this.result?.category) {
      this.quizService.startNewQuiz(this.result.category);
      this.router.navigate(['/quiz']);
    }
  }

  returnToMain() {
    this.quizService.resetQuiz(); // Limpiamos el estado antes de volver
    this.router.navigate(['/']);
  }
} 