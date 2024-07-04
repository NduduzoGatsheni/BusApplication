import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string='';
  password: string='';

  constructor(private navCtrl: NavController) {}

  login() {
    if (this.username && this.password) {
      // Add your login logic here (e.g., call your authentication API)
      console.log('Username:', this.username);
      console.log('Password:', this.password);
      // Navigate to the home page on successful login
      this.navCtrl.navigateRoot('/home');
    } else {
      // Show an error message
      console.error('Username and password are required');
    }
  }

  forgotPassword() {
    // Add your forgot password logic here
    console.log('Forgot password clicked');
  }

  signUp() {
    // Add your sign-up logic here
    console.log('Sign up clicked');
  }
}
