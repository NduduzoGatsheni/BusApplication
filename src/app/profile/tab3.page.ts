import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  studentNumber: string = '123456';
  studentName: string = 'John';
  studentSurname: string = 'Doe';
  fromTime: string = '08:00 AM';
  toTime: string = '03:00 PM';
  message: string = 'Welcome to the new semester!';
  constructor() {}

}
