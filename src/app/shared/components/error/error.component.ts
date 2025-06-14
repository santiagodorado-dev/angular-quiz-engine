import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container" *ngIf="error">
      <div class="error-content">
        <h3 class="error-title">Oops! Something went wrong</h3>
        <p class="error-message">{{ error }}</p>
        <button class="retry-button" (click)="onRetry.emit()">
          Try Again
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  @Input() error: string | null = null;
  @Output() onRetry = new EventEmitter<void>();
} 