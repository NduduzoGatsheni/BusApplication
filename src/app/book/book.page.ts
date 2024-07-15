import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {

  time!:string;
  from!: string;
  to!: string;

  constructor(private firestoreService: DataService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  submitBooking() {
    const bookingData = {
      time: this.time,
      from: this.from,
      to: this.to
    };

    this.firestoreService.addBooking(bookingData)
      .then(() => {
        console.log('Booking successfully added!');
      })
      .catch(error => {
        console.error('Error adding booking: ', error);
      });
  }
}