import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';

@Component({
  selector: 'app-add-bus',
  templateUrl: './add-bus.page.html',
  styleUrls: ['./add-bus.page.scss'],
})
export class AddBusPage implements OnInit {

  busNumber: string = '';
  residence: string = '';
  date: string = ''; // Assuming date is a string, e.g., '2023-07-17'
  time: string = ''; // Assuming time is a string, e.g., '14:00'
  totalSeats: number =0;

  constructor(private firestoreService: DataService) {}

  ngOnInit(): void {
    if (!this.date) {
      this.date = new Date().toISOString().split('T')[0]; // Set to today's date if undefined
    }
  }

  submitBus() {
    // Ensure date has a valid value or set a default
    if (!this.date) {
      this.date = new Date().toISOString().split('T')[0]; // Set to today's date if undefined
    }

    const busData = {
      busNumber: this.busNumber,
      residence: this.residence,
      totalSeats: this.totalSeats,
      time: this.time,
      // availability: this.availability
    };

    this.firestoreService.addBus(busData)
      .then(() => {
        console.log('Bus successfully added!');
      })
      .catch(error => {
        console.error('Error adding bus: ', error);
      });
  }
}
