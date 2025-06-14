import { Injectable, Inject, PLATFORM_ID, signal, computed, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme = signal<Theme>('light');
  
  // Señales públicas reactivas
  public theme = this._theme.asReadonly();
  public isDarkMode = computed(() => this._theme() === 'dark');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeTheme();
    
    // Effect para sincronizar cambios de tema automáticamente
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const currentTheme = this._theme();
        localStorage.setItem('quiz-theme', currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
      }
    });
  }

  private initializeTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('quiz-theme') as Theme;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');
      this._theme.set(theme);
    } else {
      // En el servidor, usar tema por defecto
      this._theme.set('light');
    }
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
  }

  toggleTheme(): void {
    const newTheme = this._theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this._theme();
  }
} 