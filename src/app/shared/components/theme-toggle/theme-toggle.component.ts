import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isBrowser) {
      <button 
        class="theme-toggle-btn"
        (click)="toggleTheme()"
        [attr.aria-label]="themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
        [title]="themeService.isDarkMode() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
        <span class="theme-icon">
          {{ themeService.isDarkMode() ? '☀️' : '🌙' }}
        </span>
      </button>
    }
  `,
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  isBrowser = false;

  constructor(
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
} 