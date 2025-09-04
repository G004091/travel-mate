import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface AttractionReview {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  images: string[];
  topReviews: Review[];
  latitude: number;
  longitude: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class Tab3Page implements OnInit {
  topRatedAttractions: AttractionReview[] = [];
  sortBy: 'rating' | 'reviews' | 'recent' = 'rating';
  selectedCategory: string = 'all';

  categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'historical', label: 'Historical' },
    { value: 'natural', label: 'Natural' },
    { value: 'cultural', label: 'Cultural' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadTopRatedAttractions();
  }

  private loadTopRatedAttractions() {
    // Sample data with reviews - in a real app this would come from Firebase
    this.topRatedAttractions = [
      {
        id: 1,
        name: 'Statue of Liberty',
        description: 'Iconic symbol of freedom and democracy',
        category: 'historical',
        rating: 4.8,
        reviewCount: 2547,
        images: ['https://images.unsplash.com/photo-1569959230161-9ac4aac2c8b5?w=500&h=300&fit=crop'],
        latitude: 40.6892,
        longitude: -74.0445,
        topReviews: [
          {
            id: '1',
            userName: 'Sarah M.',
            rating: 5,
            comment: 'Absolutely breathtaking! The ferry ride gives you amazing views of the city skyline. A must-visit for anyone coming to NYC.',
            date: new Date('2024-02-15'),
            helpful: 124
          },
          {
            id: '2',
            userName: 'Mike R.',
            rating: 5,
            comment: 'Incredible experience climbing to the crown. The history and symbolism is deeply moving. Book in advance!',
            date: new Date('2024-02-10'),
            helpful: 89
          },
          {
            id: '3',
            userName: 'Emma L.',
            rating: 4,
            comment: 'Beautiful monument with rich history. The audio guide is very informative. Can get crowded during peak times.',
            date: new Date('2024-02-08'),
            helpful: 67
          }
        ]
      },
      {
        id: 0,
        name: 'Central Park',
        description: 'Beautiful park in Manhattan with walking paths and lakes',
        category: 'natural',
        rating: 4.7,
        reviewCount: 1892,
        images: ['https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=500&h=300&fit=crop'],
        latitude: 40.7829,
        longitude: -73.9654,
        topReviews: [
          {
            id: '4',
            userName: 'John D.',
            rating: 5,
            comment: 'Perfect place to escape the city hustle. Great for jogging, picnics, and people watching. The fall colors are spectacular!',
            date: new Date('2024-02-12'),
            helpful: 156
          },
          {
            id: '5',
            userName: 'Lisa K.',
            rating: 5,
            comment: 'Love the Bethesda Fountain area and the boat house. So many activities for families. Clean and well-maintained.',
            date: new Date('2024-02-09'),
            helpful: 98
          },
          {
            id: '6',
            userName: 'David W.',
            rating: 4,
            comment: 'Huge park with something for everyone. Can easily spend a whole day here. The zoo is a nice addition for kids.',
            date: new Date('2024-02-07'),
            helpful: 73
          }
        ]
      },
      {
        id: 3,
        name: 'Brooklyn Bridge',
        description: 'Historic suspension bridge with stunning city views',
        category: 'historical',
        rating: 4.6,
        reviewCount: 1654,
        images: ['https://images.unsplash.com/photo-1551804049-6ee7ae579ed8?w=500&h=300&fit=crop'],
        latitude: 40.7061,
        longitude: -73.9969,
        topReviews: [
          {
            id: '7',
            userName: 'Anna T.',
            rating: 5,
            comment: 'Walking across the bridge at sunrise is magical! Best views of Manhattan skyline. Wear comfortable shoes.',
            date: new Date('2024-02-14'),
            helpful: 201
          },
          {
            id: '8',
            userName: 'Carlos M.',
            rating: 4,
            comment: 'Amazing architecture and great photo opportunities. Gets very crowded during day, early morning is better.',
            date: new Date('2024-02-11'),
            helpful: 87
          }
        ]
      },
      {
        id: 4,
        name: 'Empire State Building',
        description: 'Iconic Art Deco skyscraper with observation decks',
        category: 'cultural',
        rating: 4.5,
        reviewCount: 3102,
        images: ['https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=500&h=300&fit=crop'],
        latitude: 40.7484,
        longitude: -73.9857,
        topReviews: [
          {
            id: '9',
            userName: 'Jennifer P.',
            rating: 5,
            comment: 'Worth the wait! The 360-degree views from the observation deck are incredible, especially at sunset.',
            date: new Date('2024-02-13'),
            helpful: 143
          },
          {
            id: '10',
            userName: 'Robert H.',
            rating: 4,
            comment: 'Classic NYC experience. Skip the line tickets are worth it. The elevator ride itself is an experience!',
            date: new Date('2024-02-06'),
            helpful: 76
          }
        ]
      },
      {
        id: 2,
        name: 'Times Square',
        description: 'Bustling entertainment and shopping district',
        category: 'cultural',
        rating: 4.2,
        reviewCount: 2876,
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'],
        latitude: 40.7580,
        longitude: -73.9855,
        topReviews: [
          {
            id: '11',
            userName: 'Maya S.',
            rating: 4,
            comment: 'Exciting atmosphere and bright lights! Very crowded but that\'s part of the experience. Great for Broadway shows.',
            date: new Date('2024-02-05'),
            helpful: 92
          },
          {
            id: '12',
            userName: 'Tom B.',
            rating: 4,
            comment: 'Must see at least once. The energy is infectious. Lots of street performers and great shopping.',
            date: new Date('2024-02-04'),
            helpful: 58
          }
        ]
      }
    ];

    this.sortAttractions();
  }

  onSortChange() {
    this.sortAttractions();
  }

  onCategoryChange() {
    this.sortAttractions();
  }

  private sortAttractions() {
    let filtered = this.selectedCategory === 'all' 
      ? [...this.topRatedAttractions]
      : this.topRatedAttractions.filter(a => a.category === this.selectedCategory);

    switch (this.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'recent':
        filtered.sort((a, b) => {
          const aLatest = Math.max(...a.topReviews.map(r => r.date.getTime()));
          const bLatest = Math.max(...b.topReviews.map(r => r.date.getTime()));
          return bLatest - aLatest;
        });
        break;
    }

    this.topRatedAttractions = filtered;
  }

  getFilteredAttractions(): AttractionReview[] {
    return this.topRatedAttractions;
  }

  viewAttraction(attraction: AttractionReview) {
    this.router.navigate(['/attraction-detail', attraction.id]);
  }

  getStarArray(rating: number): number[] {
    return Array.from({length: 5}, (_, i) => i + 1);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'historical': 'primary',
      'natural': 'success',
      'cultural': 'secondary'
    };
    return colors[category] || 'medium';
  }
}