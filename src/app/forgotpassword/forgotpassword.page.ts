import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  username: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  async signup() {
    if (!this.username) {
      this.presentAlert('Error', 'Please enter your email address.');
      return;
    }

    try {
      await this.afAuth.sendPasswordResetEmail(this.username);
      this.presentAlert('Success', 'Password reset link has been sent to your email.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.presentAlert('Error', error.message);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
