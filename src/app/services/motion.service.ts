import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotionService {
  private shakeSubject = new BehaviorSubject(false);
  public shake$ = this.shakeSubject.asObservable();

  private rotationSubject = new BehaviorSubject(null);
  public rotation$ = this.rotationSubject.asObservable();

  private isListening = false;
  private shakeThreshold = 15;
  private lastShakeTime = 0;
  private shakeTimeout = 1000; // Minimum time between shakes

  constructor() {
    this.initializeMotionSensors();
  }

  // Accelerometer and Gyroscope features
  async initializeMotionSensors() {
    try {
      await Motion.addListener('accel', (event) => {
        this.handleAcceleration(event.acceleration);
      });

      await Motion.addListener('orientation', (event) => {
        this.rotationSubject.next({
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        });
      });

      this.isListening = true;
    } catch (error) {
      console.error('Error initializing motion sensors:', error);
    }
  }

  // Shake gesture detection using accelerometer
  private handleAcceleration(acceleration: any) {
    const now = Date.now();
    
    if (now - this.lastShakeTime < this.shakeTimeout) {
      return;
    }

    const totalAcceleration = Math.sqrt(
      acceleration.x * acceleration.x +
      acceleration.y * acceleration.y +
      acceleration.z * acceleration.z
    );

    if (totalAcceleration > this.shakeThreshold) {
      this.lastShakeTime = now;
      this.shakeSubject.next(true);
      
      // Reset shake state after a short delay
      setTimeout(() => {
        this.shakeSubject.next(false);
      }, 500);
    }
  }

  // Rotation gesture detection
  detectRotation(callback: (rotation: number) => void) {
    this.rotation$.subscribe(rotation => {
      if (rotation) {
        // Convert gamma (roll) to rotation degrees
        const rotationDegrees = Math.round(rotation.gamma);
        callback(rotationDegrees);
      }
    });
  }

  async stopMotionSensors() {
    if (this.isListening) {
      await Motion.removeAllListeners();
      this.isListening = false;
    }
  }

  setShakeThreshold(threshold: number) {
    this.shakeThreshold = threshold;
  }
}