import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuizState } from '../../models/quiz.model';
import { QuizQuestion } from '../../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private quizState = new BehaviorSubject<QuizState>({
    isComplete: false,
    currentQuestionIndex: 0,
    selectedAnswers: [],
    timeSpent: 0,
    category: '',
    score: 0,
    questions: []
  });

  constructor() {}

  getQuizState(): Observable<QuizState> {
    return this.quizState.asObservable();
  }

  updateQuizState(update: Partial<QuizState>): void {
    this.quizState.next({
      ...this.quizState.value,
      ...update
    });
  }

  resetQuizState(): void {
    this.quizState.next({
      isComplete: false,
      currentQuestionIndex: 0,
      selectedAnswers: [],
      timeSpent: 0,
      category: '',
      score: 0,
      questions: []
    });
  }

  setQuestions(questions: QuizQuestion[]): void {
    this.updateQuizState({ questions });
  }
} 