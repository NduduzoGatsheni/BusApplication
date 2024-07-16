import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  studentNumber: string='';
  fullName: string='';
  email: string='';
  password: string='';
  confirmPassword: string='';
  emailError : any;
  passwordError : any;
  confirmPasswordError : any;
  emailRegex: any;
  passwordRegex: any;
  
  


  constructor(private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private navController: NavController,
    private afs: AngularFirestore,
    private alertController: AlertController,
    private db: AngularFirestore,
    private toastController: ToastController,
    private router: Router,
    private firestoreService: DataService,
  ) { 

  }

  ngOnInit() {
  }

  registerStudents() {
    const studentData = {
      studentNumber:  this.studentNumber,
      fullName: this.fullName,
      email: this.email,
      password: this.password,
    };

    this.firestoreService.addBus(studentData)
      .then(() => {
        console.log('Student successfully added!');
      })
      .catch(error => {
        console.error('Error adding student: ', error);
      });
  }



  async register() {
    // // reset error messages
    this.emailError = null;
    this.passwordError = null;
    this.confirmPasswordError = null;
  
    // validate input
    if (!this.email) {
      this.emailError = 'Please enter your email';
      alert("Please enter your email");
      return;
    }
  
    if (!this.password) {
      this.passwordError = 'Please enter a password.';
      alert("Please enter a password");
      return;
    }
  
    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password.';
      alert("Please confirm your password");
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match.';
      alert("Passwords do not match");
      return;
    }
  
    if (!this.emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email address.';
      alert("Please enter a valid email address");
      return;
    }
    
    if (!this.passwordRegex.test(this.password)) {
      this.confirmPasswordError = 'Password must contain at least 8 characters including uppercase, lowercase, and numbers.';
      alert("Password must contain at least 8 characters including uppercase, lowercase, and numbers.");
      return;
    }
  
    // register user if input is valid
    const loader = await this.loadingController.create({
      message: 'Signing up',
      cssClass: 'custom-loader-class'
    });
  
    await loader.present();
    alert("Valid");
    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(async (userCredential: { user: any; }) => {
        if (userCredential.user) {
          await this.db.collection('registeredStudents').add({
            email: this.email,
          });
          // loader.dismiss();
          alert("Registered Successfully");
          this.registerStudents();
          this.navController.navigateForward("login");
        } else {
          // loader.dismiss();
          alert('User not found');
        }
      })
      .catch((error: { message: any; code: string; }) => {
        // loader.dismiss();
        const errorMessage = error.message;
        if (error.code === 'auth/email-already-in-use') {
          alert('This email is already in use. Please use a different email.');
        } else {
          alert(errorMessage);
        }
      });
  }
}
