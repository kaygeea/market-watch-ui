import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service } from '@angular/core';

@Service()
export class LocalStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Saves an item to localStorage with automatic JSON serialization.
   */
  setItem(key: string, value: unknown): void {
    if (!this.isBrowser) return;

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error saving key "${key}" to localStorage:`, error);
    }
  }

  /**
   * Retrieves and parses a strongly-typed item from localStorage.
   */
  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error parsing key "${key}" from localStorage:`, error);
      return null;
    }
  }

  /**
   * Removes a specific item from localStorage.
   */
  removeItem(key: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing key "${key}" from localStorage:`, error);
    }
  }

  /**
   * Clears all storage entries for this origin.
   */
  clear(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
