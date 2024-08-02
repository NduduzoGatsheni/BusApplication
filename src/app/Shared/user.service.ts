import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserEmail: string ='nduduzondlovu635@gmail.com';

  constructor(private db: AngularFirestore,private toastController: ToastController,private afAuth: AngularFireAuth) {}

  setCurrentUserEmail(email: string = 'nduduzondlovu635@gmail.com' ) {
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
  logout() {
    return this.afAuth.signOut();
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

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email)
}
}