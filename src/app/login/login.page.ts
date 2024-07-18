import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { UserService } from '../Shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email!: string;
  password!: string;
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  passwordError: any;

  constructor(
    private db: AngularFirestore,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private toastController: ToastController,
    private userService: UserService
  ) {}

  signUp() {
    this.navCtrl.navigateForward("/signUp");
  }

  forgotPassword() {
    this.navCtrl.navigateForward("/signUp");
  }

  async validate() {
    if (!this.email) {
      const toast = await this.toastController.create({
        message: 'Please enter your email.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    if (!this.emailRegex.test(this.email)) {
      const toast = await this.toastController.create({
        message: 'Please provide a valid email address.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    if (!this.password) {
      const toast = await this.toastController.create({
        message: 'Please enter your password.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    this.login();
  }

  async login() {
    this.passwordError = null;

    const loading = await this.loadingController.create({
      message: 'Logging in...',
    });
    await loading.present();

    this.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(async (userCred) => {
        await loading.dismiss();
        if (userCred) {
          // Store the current user's email using the UserService
          this.userService.setCurrentUserEmail(this.email);

          // Example of navigating to another page where user data can be used
          this.navCtrl.navigateForward("/tabs/tab1");
        }
      })
      .catch(async (error) => {
        await loading.dismiss();
        const errorMessage = error.message;
        if (errorMessage.includes("auth/wrong-password") || errorMessage.includes("auth/user-not-found")) {
          const toast = await this.toastController.create({
            message: 'Invalid email or password',
            duration: 2000,
            color: 'danger'
          });
          toast.present();
        } else if (errorMessage.includes("auth/invalid-email")) {
          alert("Incorrectly formatted email");
        }
      });
  }
}
