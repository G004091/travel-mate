export interface Attraction {
  id?: string;
  name: string;
  description: string;
  category: 'historical' | 'natural' | 'cultural' | 'entertainment' | 'food' | 'adventure';
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
  };
  images: string[];
  rating: number;
  reviews: Review[];
  openingHours: string;
  ticketPrice?: number;
  website?: string;
  phone?: string;
  tags: string[];
  popularity: number;
  lastUpdated: Date;
  createdBy?: string;
}

export interface Review {
  id?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  photos?: string[];
  createdAt: Date;
  helpful: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface WombatUser {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  visitedAttractions: string[];
  favoriteAttractions: string[];
  reviewCount: number;
  joinedDate: Date;
}

export interface TripPlan {
  id?: string;
  userId: string;
  name: string;
  attractions: string[];
  startDate: Date;
  endDate: Date;
  budget?: number;
  notes?: string;
  shared: boolean;
}