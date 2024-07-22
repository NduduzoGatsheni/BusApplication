import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { ActivatedRoute } from '@angular/router';
import { Bus } from '../Mode/bus.model';
import { Router } from '@angular/router';

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
  totalSeats: number = 0;

  uid?:string='';

  bus: Bus = {
    busNumber: '',
    residence: '',
    time: '',
    totalSeats: 0
  };
  buttonText: string = 'Submit'; // Default button text

  constructor(private firestoreService: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state?.['bus']) {
      this.bus = navigation.extras.state['bus'];
      this.uid = this.bus.id
      this.busNumber = this.bus.busNumber;
      this.residence = this.bus.residence;
      this.time = this.bus.time;
      this.totalSeats = this.bus.totalSeats;

      this.buttonText = 'Update'; // Change button text to 'Update'
    }

    if (!this.date) {
      this.date = new Date().toISOString().split('T')[0]; // Set to today's date if undefined
    }
  }

  submitBus() {
    // Ensure date has a valid value or set a default
    if (!this.date) {
      this.date = new Date().toISOString().split('T')[0]; // Set to today's date if undefined
    }

    const busData: Bus = {
      id: this.uid,
      busNumber: this.busNumber,
      residence: this.residence,
      totalSeats: this.totalSeats,
      time: this.time
    };

    if (this.buttonText === 'Update') {
      this.updateBus(busData);
    } else {
      this.addBus(busData);
    }
  }

  private updateBus(busData: Bus) {
    this.firestoreService.updateBus(busData)
      .then(() => {
        console.log('Bus successfully updated!');
        alert('Bus successfully updated!');
        // this.router.navigate(['/bus-list']); // Navigate to bus list or another appropriate page
      })
      .catch(error => {
        console.error('Error updating bus: ', error);
      });
  }

  private addBus(busData: Bus) {
    this.firestoreService.addBus(busData)
      .then(() => {
        this.busNumber = '';
        this.residence = '';
        this.time = '';
        this.totalSeats = 0;
        console.log('Bus successfully added!');
        alert('Bus successfully added!');
      })
      .catch(error => {
        console.error('Error adding bus: ', error);
      });
  }
}
