import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserEmail!: string;

  constructor(private db: AngularFirestore,private toastController: ToastController) {}

  setCurrentUserEmail(email: string) {
    this.currentUserEmail = email;
  }
  async presentToast(message: string, duration: number = 2000, position: 'top' | 'middle' | 'bottom' = 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
      cssClass: 'custom-toast',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
  
    await toast.present();
  }

  getCurrentUserEmail() {
    return this.currentUserEmail;
  }

  async getUserData(email: string) {
    try {
      const snapshot = await this.db.collection("registeredStudents").ref.where("email", "==", email).get();
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }
}