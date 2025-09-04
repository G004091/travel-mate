import { Injectable } from '@angular/core';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import { Attraction } from '../models/attraction.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor() {
    this.initializeNotifications();
  }

  async initializeNotifications() {
    try {
      const permissions = await LocalNotifications.requestPermissions();
      if (permissions.display !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  }

  // Push notifications - Location-based alerts
  async sendLocationNotification(attraction: Attraction, distance: number) {
    const notification: LocalNotificationSchema = {
      title: '🐨 WanderWombat Alert!',
      body: `You're ${distance}km from ${attraction.name}. Want to explore?`,
      id: Date.now(),
      schedule: { at: new Date(Date.now() + 1000) },
      sound: 'default',
      attachments: attraction.images.length > 0 ? [
        {
          id: 'attraction-image',
          url: attraction.images[0],
          options: {
            iosUNNotificationAttachmentOptionsTypeHintKey: 'public.jpeg'
          }
        }
      ] : undefined,
      actionTypeId: 'ATTRACTION_ACTIONS',
      extra: {
        attractionId: attraction.id,
        attractionName: attraction.name,
        type: 'location-based'
      }
    };

    await LocalNotifications.schedule({
      notifications: [notification]
    });
  }

  // Push notifications - Trip reminders
  async scheduleTrip notication(tripName: string, attractions: Attraction[], date: Date) {
    const notification: LocalNotificationSchema = {
      title: '🗺️ Trip Reminder',
      body: `Your "${tripName}" adventure starts today! ${attractions.length} attractions await!`,
      id: Date.now(),
      schedule: { at: date },
      sound: 'default',
      actionTypeId: 'TRIP_ACTIONS',
      extra: {
        tripName,
        attractionCount: attractions.length,
        type: 'trip-reminder'
      }
    };

    await LocalNotifications.schedule({
      notifications: [notification]
    });
  }

  // Push notifications - New attraction alerts
  async notifyNearbyNewAttraction(attraction: Attraction) {
    const notification: LocalNotificationSchema = {
      title: '✨ New Discovery!',
      body: `A new ${attraction.category} attraction "${attraction.name}" was added nearby!`,
      id: Date.now(),
      schedule: { at: new Date(Date.now() + 2000) },
      sound: 'default',
      extra: {
        attractionId: attraction.id,
        type: 'new-attraction'
      }
    };

    await LocalNotifications.schedule({
      notifications: [notification]
    });
  }

  // Handle notification actions
  async setupNotificationActions() {
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'ATTRACTION_ACTIONS',
          actions: [
            {
              id: 'view',
              title: 'View Details',
              requiresAuthentication: false,
              foreground: true
            },
            {
              id: 'directions',
              title: 'Get Directions',
              requiresAuthentication: false,
              foreground: true
            }
          ]
        },
        {
          id: 'TRIP_ACTIONS',
          actions: [
            {
              id: 'view-trip',
              title: 'View Trip',
              requiresAuthentication: false,
              foreground: true
            },
            {
              id: 'snooze',
              title: 'Remind Later',
              requiresAuthentication: false,
              foreground: false
            }
          ]
        }
      ]
    });
  }
}