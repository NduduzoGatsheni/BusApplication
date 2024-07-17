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
  studentNumber: string = '';
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  emailError: any;
  passwordError: any;
  confirmPasswordError: any;

  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  constructor(
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private navController: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private firestoreService: DataService,
  ) {}

  ngOnInit() {}

  registerStudents() {
    const studentData = {
      studentNumber: this.studentNumber,
      fullName: this.fullName,
      email: this.email,
      password: this.password,
    };

    this.firestoreService.addStudent(studentData)
      .then(() => {
        console.log('Student successfully added!');
      })
      .catch(error => {
        console.error('Error adding student: ', error);
      });
  }

 async register() {
  

    const loading = await this.loadingController.create({
      message: 'Registering...',
    });
    await loading.present();
    // alert("Valid");
    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(async (userCredential: { user: any; }) => {
        await loading.dismiss();
        if (userCredential.user) {
          await this.firestore.collection('registeredStudents').add({
            email: this.email,
          });
          // this.registerStudents();
          this.navController.navigateForward("login");
        } else {
          alert('User not found');
        }
      })
      .catch((error: { message: any; code: string; }) => {
        loading.dismiss();
        const errorMessage = error.message;
        if (error.code === 'auth/email-already-in-use') {
          alert('This email is already in use. Please use a different email.');
        } else {
          alert(errorMessage);
        }
      });
  }
}
