export const environment = {
  production: false,
  apiUrl: 'http://localhost:4200',
  version: '1.0.0',
  appName: 'Quiz Engine',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es'],
  features: {
    enableAnalytics: false,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true
  }
} as const; 