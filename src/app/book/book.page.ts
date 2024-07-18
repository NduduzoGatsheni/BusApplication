import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { map, Observable } from 'rxjs';
import { Bus } from '../Mode/bus.model';
import { UserService } from '../Shared/user.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {

  time!: string;
  from!: string;
  residence!: string;
  busData$!: Observable<Bus[]>;

  busData: any[] = [];

  constructor(private dataService: DataService,
              private userService: UserService) {}

  ngOnInit() {
    this.fetchBusData();
  }

  fetchBusData() {
    this.busData$ = this.dataService.getBusData().pipe(
      map((actions: any[]) => actions.map((a: { payload: { doc: { data: () => Bus; id: any; }; }; }) => {
        const data = a.payload.doc.data() as Bus;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.busData$.subscribe(data => {
      this.busData = data;
    });
  }

  async submitBooking() {
    const email = this.userService.getCurrentUserEmail();

    const matchedBus = this.busData.find(bus => bus.residence === this.residence && bus.time === this.time);

    if (matchedBus && matchedBus.totalSeats > 0) {
      // Update totalSeats
      const updatedSeats = matchedBus.totalSeats - 1;
      try {
        await this.dataService.updateBusSeats(matchedBus.id, updatedSeats);

        // Add booking data
        const bookingData = {
          time: this.time,
          residence: this.residence,
          busNumber: matchedBus.busNumber,
          // email: email
        };

        await this.dataService.addBooking(bookingData);
        console.log('Booking successfully added!');
      } catch (error) {
        console.error('Error updating bus seats or adding booking: ', error);
      }
    } else {
      console.log('No available seats or bus not found');
    }
  }
}
