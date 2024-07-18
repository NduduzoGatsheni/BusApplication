import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { map, Observable } from 'rxjs';
import { Bus } from '../Mode/bus.model';
import { UserService } from '../Shared/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController } from '@ionic/angular';

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
  userData: any; // Store user data here

  constructor(private dataService: DataService,
              private userService: UserService,
              private db: AngularFirestore,
            private navCtrl: NavController) {}

  ngOnInit() {
    this.fetchBusData();
    const email = this.userService.getCurrentUserEmail();
    if (email) {
      this.getUserData(email);
    }
  }

  async getUserData(email: string) {
    try {
      const snapshot = await this.db.collection("registeredStudents").ref.where("email", "==", email).get();
      if (!snapshot.empty) {
        this.userData = snapshot.docs[0].data(); // Store user data
        return this.userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
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

  nav() {
    this.navCtrl.navigateForward("/tab/tab2");
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
          email: email,
          studentNumber: this.userData.studentNumber, 
        };

        await this.dataService.addBooking(bookingData);
        this.nav();
        console.log('Booking successfully added!');
      } catch (error) {
        console.error('Error updating bus seats or adding booking: ', error);
      }
    } else {
      console.log('No available seats or bus not found');
    }
  }
}
