import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  studentNumber: string = '123456';
  studentName: string = 'John';
  studentSurname: string = 'Doe';
  fromTime: string = '08:00 AM';
  toTime: string = '03:00 PM';
  message: string = 'Welcome to the new semester!';
  constructor() {}

}
