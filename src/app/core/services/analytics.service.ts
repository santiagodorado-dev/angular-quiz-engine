import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private eventsSubject = new BehaviorSubject<AnalyticsEvent[]>([]);
  private isEnabled = environment.features.enableAnalytics;

  constructor() {
    if (this.isEnabled) {
      this.initializeAnalytics();
    }
  }

  private initializeAnalytics(): void {
    console.log('Analytics initialized');
  }

  trackEvent(eventName: string, properties?: Record<string, unknown>): Observable<void> {
    return new Observable(subscriber => {
      if (!this.isEnabled) {
        subscriber.complete();
        return;
      }

      const event: AnalyticsEvent = {
        name: eventName,
        properties,
        timestamp: Date.now()
      };

      this.eventsSubject.next([...this.eventsSubject.value, event]);
      console.log(`Event tracked: ${eventName}`, properties);
      subscriber.next();
      subscriber.complete();
    });
  }

  trackQuizStart(category: string): Observable<void> {
    return this.trackEvent('quiz_start', { category });
  }

  trackQuizComplete(category: string, score: number): Observable<void> {
    return this.trackEvent('quiz_complete', { category, score });
  }

  trackQuestionAnswered(category: string, questionIndex: number, isCorrect: boolean): Observable<void> {
    return this.trackEvent('question_answered', {
      category,
      questionIndex,
      isCorrect
    });
  }

  getEventCount(eventName: string): Observable<number> {
    return this.eventsSubject.pipe(
      map(events => events.filter(event => event.name === eventName).length)
    );
  }

  getAllEvents(): Observable<AnalyticsEvent[]> {
    return this.eventsSubject.asObservable();
  }

  clearEvents(): Observable<void> {
    return new Observable(subscriber => {
      this.eventsSubject.next([]);
      subscriber.next();
      subscriber.complete();
    });
  }

  ngOnDestroy(): void {
    this.eventsSubject.complete();
  }
} 