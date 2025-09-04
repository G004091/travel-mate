import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  
  constructor(private actionSheetController: ActionSheetController) {}

  // Camera feature - Show options and take photo
  async showCameraOptions(): Promise<string | null> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Add Photo',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: async () => {
            actionSheet.dismiss(await this.takePhoto());
            return false; // Prevent default dismiss
          }
        },
        {
          text: 'Choose from Gallery',
          icon: 'images',
          handler: async () => {
            actionSheet.dismiss(await this.selectFromGallery());
            return false; // Prevent default dismiss
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();
    return result.data || null;
  }

  // Camera access - Take photo
  async takePhoto(): Promise<string | null> {
    try {
      const photo: Photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 800,
        height: 600
      });

      return photo.dataUrl || null;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  }

  // Camera access - Select from gallery
  async selectFromGallery(): Promise<string | null> {
    try {
      const photo: Photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        width: 800,
        height: 600
      });

      return photo.dataUrl || null;
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      return null;
    }
  }

  // Take multiple photos for reviews
  async takeMultiplePhotos(maxPhotos: number = 5): Promise<string[]> {
    const photos: string[] = [];
    
    for (let i = 0; i < maxPhotos; i++) {
      const photo = await this.takePhoto();
      if (photo) {
        photos.push(photo);
      } else {
        break; // User cancelled or error occurred
      }
      
      // Ask if user wants to take another photo
      if (i < maxPhotos - 1) {
        const continueResult = await this.askForAnotherPhoto();
        if (!continueResult) break;
      }
    }
    
    return photos;
  }

  private async askForAnotherPhoto(): Promise<boolean> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Add Another Photo?',
      buttons: [
        {
          text: 'Yes, Add Another',
          icon: 'camera',
          handler: () => {
            actionSheet.dismiss(true);
            return false;
          }
        },
        {
          text: 'Done',
          icon: 'checkmark',
          handler: () => {
            actionSheet.dismiss(false);
            return false;
          }
        }
      ]
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();
    return result.data || false;
  }
}