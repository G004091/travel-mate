import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LocationService, UserLocation } from '../services/location.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class Tab1Page implements OnInit {
  attractions: any[] = [];
  selectedCategory = 'all';
  currentLocation: UserLocation | null = null;
  
  categories = [
    { value: 'all', label: 'All Adventures', icon: 'globe-outline' },
    { value: 'historical', label: 'Historical', icon: 'library-outline' },
    { value: 'natural', label: 'Natural', icon: 'leaf-outline' },
    { value: 'cultural', label: 'Cultural', icon: 'people-outline' }
  ];

  constructor(
    private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.attractions = [
      {
        id: 0,
        name: 'Central Park',
        description: 'Beautiful park in Manhattan with walking paths and lakes',
        category: 'natural',
        rating: 4.5,
        latitude: 40.7829,
        longitude: -73.9654,
        images: ['https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=500&h=300&fit=crop']
      },
      {
        id: 1,
        name: 'Statue of Liberty',
        description: 'Iconic symbol of freedom and democracy',
        category: 'historical', 
        rating: 4.7,
        latitude: 40.6892,
        longitude: -74.0445,
        images: ['https://images.unsplash.com/photo-1569959230161-9ac4aac2c8b5?w=500&h=300&fit=crop']
      },
      {
        id: 2,
        name: 'Times Square',
        description: 'Bustling entertainment and shopping district',
        category: 'cultural',
        rating: 4.2,
        latitude: 40.7580,
        longitude: -73.9855,
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop']
      },
      {
        id: 3,
        name: 'Brooklyn Bridge',
        description: 'Historic suspension bridge connecting Manhattan and Brooklyn',
        category: 'historical',
        rating: 4.6,
        latitude: 40.7061,
        longitude: -73.9969,
        images: ['https://images.unsplash.com/photo-1551804049-6ee7ae579ed8?w=500&h=300&fit=crop']
      },
      {
        id: 4,
        name: 'Empire State Building',
        description: 'Iconic Art Deco skyscraper with observation decks',
        category: 'cultural',
        rating: 4.4,
        latitude: 40.7484,
        longitude: -73.9857,
        images: ['https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=500&h=300&fit=crop']
      },
      {
        id: 5,
        name: 'High Line',
        description: 'Elevated linear park built on former railway tracks',
        category: 'natural',
        rating: 4.3,
        latitude: 40.7480,
        longitude: -74.0048,
        images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=300&fit=crop']
      }
    ];

    // Get user location
    this.locationService.currentLocation$.subscribe(location => {
      this.currentLocation = location;
    });
    this.locationService.getCurrentLocation();
  }

  onCategoryChange() {
    console.log('Category changed to:', this.selectedCategory);
  }

  getFilteredAttractions() {
    if (this.selectedCategory === 'all') {
      return this.attractions;
    }
    return this.attractions.filter(attraction => attraction.category === this.selectedCategory);
  }

  getDistanceToAttraction(attraction: any): number {
    if (!this.currentLocation) return 0;
    return this.locationService.calculateDistance(
      this.currentLocation.latitude,
      this.currentLocation.longitude,
      attraction.latitude,
      attraction.longitude
    );
  }

  viewAttraction(attraction: any) {
    this.router.navigate(['/attraction-detail', attraction.id]);
  }
}