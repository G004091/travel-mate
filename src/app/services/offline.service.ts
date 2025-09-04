import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Attraction } from '../models/attraction.model';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private cachedAttractions = new BehaviorSubject([]);
  private isOnline = new BehaviorSubject(navigator.onLine);
  
  public cachedAttractions$ = this.cachedAttractions.asObservable();
  public isOnline$ = this.isOnline.asObservable();

  constructor() {
    this.setupNetworkListeners();
    this.loadCachedData();
  }

  // Caching/Offline Readiness feature
  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline.next(true);
      console.log('WanderWombat: Back online!');
    });

    window.addEventListener('offline', () => {
      this.isOnline.next(false);
      console.log('WanderWombat: Gone offline - using cached data');
    });
  }

  // Cache attractions for offline use
  cacheAttractions(attractions: Attraction[]) {
    // In a real app, you would use Ionic Storage or IndexedDB
    // For now, we'll use memory storage
    this.cachedAttractions.next(attractions);
    
    // Store in localStorage as backup (with size limits)
    try {
      const cacheData = {
        timestamp: Date.now(),
        attractions: attractions.slice(0, 100) // Limit to prevent storage overflow
      };
      localStorage.setItem('wanderwombat_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Could not cache to localStorage:', error);
    }
  }

  private loadCachedData() {
    try {
      const cached = localStorage.getItem('wanderwombat_cache');
      if (cached) {
        const data = JSON.parse(cached);
        // Only use cache if less than 24 hours old
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          this.cachedAttractions.next(data.attractions);
        }
      }
    } catch (error) {
      console.warn('Could not load cached data:', error);
    }
  }

  getCachedAttractions(): Attraction[] {
    return this.cachedAttractions.value;
  }

  isOffline(): boolean {
    return !this.isOnline.value;
  }
}