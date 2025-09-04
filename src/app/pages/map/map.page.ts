import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import * as L from 'leaflet';
import { LocationService, UserLocation } from '../../services/location.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class MapPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  
  private map: L.Map | null = null;
  private userMarker: L.Marker | null = null;
  private attractionMarkers: L.Marker[] = [];
  private locationSubscription?: Subscription;
  private longPressTimer: any;
  
  currentLocation: UserLocation | null = null;
  isLocationEnabled = false;

  attractions = [
    { id: 0, name: 'Central Park', latitude: 40.7829, longitude: -73.9654, category: 'natural' },
    { id: 1, name: 'Statue of Liberty', latitude: 40.6892, longitude: -74.0445, category: 'historical' },
    { id: 2, name: 'Times Square', latitude: 40.7580, longitude: -73.9855, category: 'cultural' },
    { id: 3, name: 'Brooklyn Bridge', latitude: 40.7061, longitude: -73.9969, category: 'historical' },
    { id: 4, name: 'Empire State Building', latitude: 40.7484, longitude: -73.9857, category: 'cultural' }
  ];

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.initializeLocationTracking();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeMap();
    }, 100);
  }

  ngOnDestroy() {
    this.locationSubscription?.unsubscribe();
    this.locationService.stopLocationTracking();
    if (this.map) {
      this.map.remove();
    }
  }

  private async initializeLocationTracking() {
    this.locationSubscription = this.locationService.currentLocation$.subscribe(location => {
      this.currentLocation = location;
      this.isLocationEnabled = !!location;
      
      if (location && this.map) {
        this.updateUserLocation(location);
      }
    });

    await this.locationService.getCurrentLocation();
    await this.locationService.startLocationTracking();
  }

  private initializeMap() {
    const defaultCenter: [number, number] = [40.7128, -74.0060];
    const center = this.currentLocation 
      ? [this.currentLocation.latitude, this.currentLocation.longitude] as [number, number]
      : defaultCenter;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: center,
      zoom: 13,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(this.map);

    this.addAttractionMarkers();

    if (this.currentLocation) {
      this.updateUserLocation(this.currentLocation);
    }

    this.setupGestureListeners();
  }

  private addAttractionMarkers() {
    if (!this.map) return;

    this.attractions.forEach(attraction => {
      const icon = this.getCustomIcon(attraction.category);
      
      const marker = L.marker([attraction.latitude, attraction.longitude], { icon })
        .addTo(this.map!)
        .bindPopup(`
          <div style="text-align: center; min-width: 120px;">
            <h4 style="margin: 0 0 6px 0; color: #333;">${attraction.name}</h4>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${attraction.category.toUpperCase()}</p>
            <button onclick="window.location.href='#/attraction-detail/${attraction.id}'" 
                    style="background: #3880ff; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
              View Details
            </button>
          </div>
        `);

      this.attractionMarkers.push(marker);
    });
  }

  private getCustomIcon(category: string): L.DivIcon {
    const iconColors = {
      natural: '#10b981',
      historical: '#3b82f6',
      cultural: '#8b5cf6'
    };

    const color = iconColors[category as keyof typeof iconColors] || '#6b7280';

    return L.divIcon({
      html: `
        <div style="
          background-color: ${color}; 
          width: 24px; 
          height: 24px; 
          border-radius: 50%; 
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
      `,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }

  private updateUserLocation(location: UserLocation) {
    if (!this.map) return;

    if (this.userMarker) {
      this.map.removeLayer(this.userMarker);
    }

    const userIcon = L.divIcon({
      html: `
        <div style="
          background-color: #4285f4; 
          width: 20px; 
          height: 20px; 
          border-radius: 50%; 
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          position: relative;
        ">
          <div style="
            background-color: rgba(66, 133, 244, 0.3);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            position: absolute;
            top: -14px;
            left: -14px;
            animation: pulse 2s infinite;
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(2.5); opacity: 0; }
          }
        </style>
      `,
      className: 'user-location-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    this.userMarker = L.marker([location.latitude, location.longitude], { icon: userIcon })
      .addTo(this.map)
      .bindPopup('Your Location');

    this.map.setView([location.latitude, location.longitude], this.map.getZoom());
  }

  private setupGestureListeners() {
    if (!this.mapContainer) return;

    const mapElement = this.mapContainer.nativeElement;

    // Tap gesture
    mapElement.addEventListener('click', (e: MouseEvent) => {
      this.showGestureFeedback('Tap detected');
    });

    // Long press for desktop
    mapElement.addEventListener('mousedown', (e: MouseEvent) => {
      this.longPressTimer = setTimeout(() => {
        this.handleLongPress(e);
      }, 800);
    });

    mapElement.addEventListener('mouseup', () => {
      clearTimeout(this.longPressTimer);
    });

    mapElement.addEventListener('mouseleave', () => {
      clearTimeout(this.longPressTimer);
    });

    // Touch events for mobile
    mapElement.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.longPressTimer = setTimeout(() => {
          this.handleLongPress(e);
        }, 800);
      } else if (e.touches.length === 2) {
        clearTimeout(this.longPressTimer);
        this.showGestureFeedback('Pinch gesture detected');
      }
    });

    mapElement.addEventListener('touchend', () => {
      clearTimeout(this.longPressTimer);
    });

    mapElement.addEventListener('touchmove', () => {
      clearTimeout(this.longPressTimer);
    });

    // Wheel event for zoom detection
    mapElement.addEventListener('wheel', () => {
      this.showGestureFeedback('Zoom gesture detected');
    });
  }

  private handleLongPress(e: MouseEvent | TouchEvent) {
    this.showGestureFeedback('Long press detected - Adding temporary marker');
    
    if (this.map) {
      let latLng;
      
      if (e instanceof MouseEvent) {
        const containerPoint = this.map.mouseEventToContainerPoint(e);
        latLng = this.map.containerPointToLatLng(containerPoint);
      } else if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.mapContainer.nativeElement.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const containerPoint = L.point(x, y);
        latLng = this.map.containerPointToLatLng(containerPoint);
      }
      
      if (latLng) {
        const tempMarker = L.marker([latLng.lat, latLng.lng])
          .addTo(this.map)
          .bindPopup('Long press location')
          .openPopup();

        setTimeout(() => {
          if (this.map) {
            this.map.removeLayer(tempMarker);
          }
        }, 3000);
      }
    }
    
    e.preventDefault();
  }

  private showGestureFeedback(message: string) {
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 2000;
      pointer-events: none;
      max-width: 200px;
      text-align: center;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      if (document.body.contains(feedback)) {
        document.body.removeChild(feedback);
      }
    }, 2000);
  }

  async centerOnUserLocation() {
    if (this.currentLocation && this.map) {
      this.map.setView([this.currentLocation.latitude, this.currentLocation.longitude], 15);
      this.showGestureFeedback('Centered on your location');
    } else {
      await this.locationService.getCurrentLocation();
    }
  }
}