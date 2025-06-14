import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { QuizQuestion } from '../../../models/quiz.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.scss']
})
export class QuizQuestionComponent implements OnInit, OnDestroy {
  currentQuestion: QuizQuestion | null = null;
  currentIndex = 0;
  totalQuestions = 0;
  selectedAnswer: string | null = null;
  showFeedback = false;
  isCorrect = false;
  isLastQuestion = false;
  progress = 0;
  questions: QuizQuestion[] = [];
  private stateSubscription: Subscription | null = null;

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit() {
    this.stateSubscription = this.quizService.getQuizState().subscribe(state => {
      if (!state.category) {
        this.router.navigate(['/']);
        return;
      }

      this.questions = state.questions;
      this.totalQuestions = this.questions.length;

      if (!this.questions.length) {
        this.router.navigate(['/results']);
        return;
      }

      this.currentIndex = state.currentQuestionIndex;
      if (
        this.currentIndex < 0 ||
        this.currentIndex >= this.questions.length ||
        !this.questions[this.currentIndex]
      ) {
        this.router.navigate(['/results']);
        return;
      }
      this.currentQuestion = this.questions[this.currentIndex];
      this.selectedAnswer = state.selectedAnswers[this.currentIndex] || null;
      this.isLastQuestion = this.currentIndex === this.totalQuestions - 1;
      this.progress = Math.round(((this.currentIndex + 1) / this.totalQuestions) * 100);
      this.showFeedback = false;
      this.isCorrect = false;
    });
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  selectAnswer(answer: string) {
    if (this.showFeedback) return;

    this.selectedAnswer = answer;
    this.quizService.selectAnswer(answer);
    this.showFeedback = true;
    this.isCorrect = answer === this.currentQuestion?.correctAnswer;
  }

  nextQuestion() {
    if (this.isLastQuestion) {
      this.quizService.completeQuiz();
      this.router.navigate(['/results']);
    } else {
      this.quizService.nextQuestion();
    }
  }
} 