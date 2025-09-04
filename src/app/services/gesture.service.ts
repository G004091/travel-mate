import { Injectable } from '@angular/core';
import { GestureController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

export interface GestureEvent {
  type: 'swipe' | 'pinch' | 'longpress' | 'shake' | 'rotate';
  direction?: 'left' | 'right' | 'up' | 'down';
  scale?: number;
  rotation?: number;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class GestureService {
  private gestureSubject = new BehaviorSubject(null);
  public gesture$ = this.gestureSubject.asObservable();

  constructor(private gestureCtrl: GestureController) {}

  // Swipe gesture implementation
  createSwipeGesture(element: HTMLElement, callback?: (event: GestureEvent) => void) {
    const swipeGesture = this.gestureCtrl.create({
      el: element,
      threshold: 15,
      gestureName: 'swipe',
      direction: 'x',
      onEnd: (detail) => {
        const direction = detail.deltaX > 0 ? 'right' : 'left';
        const event: GestureEvent = { type: 'swipe', direction };
        
        this.gestureSubject.next(event);
        callback?.(event);
      }
    }, true);

    swipeGesture.enable(true);
    return swipeGesture;
  }

  // Pinch gesture for zoom
  createPinchGesture(element: HTMLElement, callback?: (event: GestureEvent) => void) {
    const pinchGesture = this.gestureCtrl.create({
      el: element,
      threshold: 0,
      gestureName: 'pinch',
      onMove: (detail) => {
        const event: GestureEvent = { type: 'pinch', scale: detail.scale };
        this.gestureSubject.next(event);
        callback?.(event);
      }
    }, true);

    pinchGesture.enable(true);
    return pinchGesture;
  }

  // Long press gesture
  createLongPressGesture(element: HTMLElement, callback?: (event: GestureEvent) => void) {
    let pressTimer: any;
    
    const startPress = () => {
      pressTimer = setTimeout(() => {
        const event: GestureEvent = { type: 'longpress' };
        this.gestureSubject.next(event);
        callback?.(event);
      }, 800);
    };

    const endPress = () => {
      clearTimeout(pressTimer);
    };

    element.addEventListener('touchstart', startPress);
    element.addEventListener('mousedown', startPress);
    element.addEventListener('touchend', endPress);
    element.addEventListener('mouseup', endPress);
    element.addEventListener('mouseleave', endPress);

    return {
      destroy: () => {
        element.removeEventListener('touchstart', startPress);
        element.removeEventListener('mousedown', startPress);
        element.removeEventListener('touchend', endPress);
        element.removeEventListener('mouseup', endPress);
        element.removeEventListener('mouseleave', endPress);
      }
    };
  }

  // Drag and drop gesture
  createDragGesture(element: HTMLElement, callback?: (event: any) => void) {
    const dragGesture = this.gestureCtrl.create({
      el: element,
      threshold: 0,
      gestureName: 'drag',
      onMove: (detail) => {
        element.style.transform = `translateX(${detail.deltaX}px) translateY(${detail.deltaY}px)`;
        callback?.(detail);
      },
      onEnd: (detail) => {
        element.style.transform = '';
        callback?.(detail);
      }
    }, true);

    dragGesture.enable(true);
    return dragGesture;
  }
}