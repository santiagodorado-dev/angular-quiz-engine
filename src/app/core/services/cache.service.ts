import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: Map<string, CacheItem<unknown>> = new Map();
  private cacheSubject = new BehaviorSubject<Map<string, CacheItem<unknown>>>(new Map());
  private readonly DEFAULT_EXPIRATION = 5 * 60 * 1000; // 5 minutes
  private cleanupInterval: number;

  constructor() {
    // Clean expired items every minute
    this.cleanupInterval = window.setInterval(() => this.cleanExpiredItems(), 60 * 1000);
  }

  set<T>(key: string, data: T, expiresIn: number = this.DEFAULT_EXPIRATION): Observable<void> {
    return new Observable(subscriber => {
      try {
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          expiresIn
        });
        this.cacheSubject.next(this.cache);
        subscriber.next();
        subscriber.complete();
      } catch (error) {
        console.error('Error setting cache item:', error);
        subscriber.error(error);
      }
    });
  }

  get<T>(key: string): Observable<T | null> {
    return this.cacheSubject.pipe(
      map(cache => {
        const item = cache.get(key);
        if (!item) return null;
        if (this.isExpired(item)) {
          this.cache.delete(key);
          this.cacheSubject.next(this.cache);
          return null;
        }
        return item.data as T;
      })
    );
  }

  has(key: string): Observable<boolean> {
    return this.cacheSubject.pipe(
      map(cache => {
        const item = cache.get(key);
        return item ? !this.isExpired(item) : false;
      })
    );
  }

  delete(key: string): Observable<void> {
    return new Observable(subscriber => {
      try {
        this.cache.delete(key);
        this.cacheSubject.next(this.cache);
        subscriber.next();
        subscriber.complete();
      } catch (error) {
        console.error('Error deleting cache item:', error);
        subscriber.error(error);
      }
    });
  }

  clear(): Observable<void> {
    return new Observable(subscriber => {
      try {
        this.cache.clear();
        this.cacheSubject.next(this.cache);
        subscriber.next();
        subscriber.complete();
      } catch (error) {
        console.error('Error clearing cache:', error);
        subscriber.error(error);
      }
    });
  }

  private isExpired(item: CacheItem<unknown>): boolean {
    return Date.now() - item.timestamp > item.expiresIn;
  }

  private cleanExpiredItems(): void {
    try {
      let hasChanges = false;
      for (const [key, item] of this.cache.entries()) {
        if (this.isExpired(item)) {
          this.cache.delete(key);
          hasChanges = true;
        }
      }
      if (hasChanges) {
        this.cacheSubject.next(this.cache);
      }
    } catch (error) {
      console.error('Error cleaning expired items:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cacheSubject.complete();
  }
} 