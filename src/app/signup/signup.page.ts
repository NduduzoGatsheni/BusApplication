import { Component, OnInit } from '@angular/core';

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
  constructor() { 

  }

  ngOnInit() {
  }
  register() {
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    // Handle registration logic here
    console.log('Register clicked');
    console.log('Student Number:', this.studentNumber);
    console.log('Full Name:', this.fullName);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}
