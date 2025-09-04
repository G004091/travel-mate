import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
  isAnonymous: boolean;
}

interface Attraction {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  images: string[];
  reviews: Review[];
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  hours: string;
  phone?: string;
  website?: string;
  ticketPrice: number;
}

@Component({
  selector: 'app-attraction-detail',
  templateUrl: './attraction-detail.page.html',
  styleUrls: ['./attraction-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AttractionDetailPage implements OnInit {
  attraction: Attraction | null = null;
  showReviewForm = false;
  
  // Review form data
  reviewForm = {
    userName: '',
    rating: 5,
    comment: '',
    isAnonymous: false
  };

  // Sample attractions with reviews
  attractions: Attraction[] = [
    {
      id: 0,
      name: 'Central Park',
      description: 'Beautiful park in Manhattan with walking paths and lakes. Central Park is a 843-acre public park that offers various recreational activities, beautiful landscapes, and is a perfect escape from the bustling city life.',
      category: 'natural',
      rating: 4.7,
      reviewCount: 1892,
      images: [
        'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551634979-c1aa0d5c5bbc?w=600&h=400&fit=crop'
      ],
      location: {
        address: 'New York, NY 10024',
        latitude: 40.7829,
        longitude: -73.9654
      },
      hours: '6:00 AM - 1:00 AM',
      phone: '+1 212-310-6600',
      website: 'https://www.centralparknyc.org',
      ticketPrice: 0,
      reviews: [
        {
          id: '1',
          userName: 'John D.',
          rating: 5,
          comment: 'Amazing place to relax and enjoy nature! Perfect for jogging and picnics.',
          date: new Date('2024-02-15'),
          helpful: 23,
          isAnonymous: false
        },
        {
          id: '2',
          userName: 'Anonymous',
          rating: 4,
          comment: 'Beautiful park, great for families. Can get crowded on weekends.',
          date: new Date('2024-02-10'),
          helpful: 18,
          isAnonymous: true
        }
      ]
    },
    {
      id: 1,
      name: 'Statue of Liberty',
      description: 'Iconic symbol of freedom and democracy. The Statue of Liberty is a neoclassical sculpture on Liberty Island in New York Harbor.',
      category: 'historical',
      rating: 4.8,
      reviewCount: 2547,
      images: [
        'https://images.unsplash.com/photo-1569959230161-9ac4aac2c8b5?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop'
      ],
      location: {
        address: 'Liberty Island, New York, NY 10004',
        latitude: 40.6892,
        longitude: -74.0445
      },
      hours: '9:00 AM - 5:00 PM',
      phone: '+1 212-363-3200',
      website: 'https://www.nps.gov/stli/',
      ticketPrice: 25,
      reviews: [
        {
          id: '3',
          userName: 'Sarah M.',
          rating: 5,
          comment: 'Breathtaking views and rich history! Must book crown access in advance.',
          date: new Date('2024-02-12'),
          helpful: 45,
          isAnonymous: false
        },
        {
          id: '4',
          userName: 'TravelLover_NYC',
          rating: 5,
          comment: 'Incredible experience! The ferry ride gives amazing city views too.',
          date: new Date('2024-02-08'),
          helpful: 32,
          isAnonymous: false
        }
      ]
    }
    // Add more attractions as needed
  ];

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.attraction = this.attractions.find(a => a.id === id) || null;
  }

  toggleReviewForm() {
    this.showReviewForm = !this.showReviewForm;
    
    // Reset form when closing
    if (!this.showReviewForm) {
      this.resetReviewForm();
    }
  }

  resetReviewForm() {
    this.reviewForm = {
      userName: '',
      rating: 5,
      comment: '',
      isAnonymous: false
    };
  }

  async submitReview() {
    // Validate form
    if (!this.reviewForm.comment.trim()) {
      const alert = await this.alertController.create({
        header: 'Missing Information',
        message: 'Please write a comment about your experience.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.reviewForm.isAnonymous && !this.reviewForm.userName.trim()) {
      const alert = await this.alertController.create({
        header: 'Missing Information',
        message: 'Please enter your name or select "Submit Anonymously".',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.attraction) return;

    // Create new review
    const newReview: Review = {
      id: Date.now().toString(),
      userName: this.reviewForm.isAnonymous ? 'Anonymous' : (this.reviewForm.userName.trim() || 'Anonymous'),
      rating: this.reviewForm.rating,
      comment: this.reviewForm.comment.trim(),
      date: new Date(),
      helpful: 0,
      isAnonymous: this.reviewForm.isAnonymous
    };

    // Add review to attraction
    this.attraction.reviews.unshift(newReview);
    this.attraction.reviewCount++;

    // Recalculate average rating
    const totalRating = this.attraction.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.attraction.rating = Math.round((totalRating / this.attraction.reviews.length) * 10) / 10;

    // Show success message
    const toast = await this.toastController.create({
      message: 'Review submitted successfully! Thank you for your feedback.',
      duration: 3000,
      position: 'top',
      color: 'success'
    });
    await toast.present();

    // Reset form and hide
    this.resetReviewForm();
    this.showReviewForm = false;
  }

  async markHelpful(review: Review) {
    review.helpful++;
    
    const toast = await this.toastController.create({
      message: 'Thank you for your feedback!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  getStarArray(rating: number): number[] {
    return Array.from({length: 5}, (_, i) => i + 1);
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  openInMaps() {
    if (this.attraction) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${this.attraction.location.latitude},${this.attraction.location.longitude}`;
      window.open(url, '_system');
    }
  }

  callAttraction() {
    if (this.attraction?.phone) {
      window.open(`tel:${this.attraction.phone}`, '_system');
    }
  }

  visitWebsite() {
    if (this.attraction?.website) {
      window.open(this.attraction.website, '_system');
    }
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'historical': 'primary',
      'natural': 'success',
      'cultural': 'secondary'
    };
    return colors[category] || 'medium';
  }
  increaseRating() {
  if (this.reviewForm.rating < 5) {
    this.reviewForm.rating++;
  }
}

decreaseRating() {
  if (this.reviewForm.rating > 1) {
    this.reviewForm.rating--;
  }
}

setRating(rating: number) {
  this.reviewForm.rating = rating;
 }
}

