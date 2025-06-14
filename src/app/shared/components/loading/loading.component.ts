import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" *ngIf="isLoading">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ message }}</p>
    </div>
  `,
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() isLoading = false;
  @Input() message = 'Loading...';
} 