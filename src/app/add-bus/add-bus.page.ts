import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';

@Component({
  selector: 'app-add-bus',
  templateUrl: './add-bus.page.html',
  styleUrls: ['./add-bus.page.scss'],
})
export class AddBusPage implements OnInit {

  busNumber!: string;
  residence!: string;
  date!: string;
  time!: string;
  availability!: boolean;

  constructor(private firestoreService: DataService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  submitBus() {
    const busData = {
      busNumber: this.busNumber,
      residence: this.residence,
      date: this.date,
      time: this.time,
      availability: this.availability
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