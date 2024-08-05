import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { map, Observable } from 'rxjs';
import { Bus } from '../Mode/bus.model';
import { UserService } from '../Shared/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router'; 
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
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
  bus: any;
  uid: any;
  busNumber: any;
  totalSeats: any;
  buttonText: string | undefined;
  message:string='';

  constructor(private dataService: DataService,
              private userService: UserService,
              private db: AngularFirestore,
            private navCtrl: NavController,
            private alertController: AlertController,
            private toastController: ToastController,
            private router: Router) {}

  ngOnInit() {
    this.fetchBusData();
    const email = this.userService.getCurrentUserEmail();
    if (email) {
      // alert(email);
      this.getUserData(email);
    }
    
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state?.['bus']) {
      this.bus = navigation.extras.state['bus'];
      this.uid = this.bus.id
      this.busNumber = this.bus.busNumber;
      this.residence = this.bus.residence;
      this.time = this.bus.time;
      this.totalSeats = this.bus.totalSeats;
      this.message = this.bus.message;
      this.buttonText = 'Update'; // Change button text to 'Update'
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
    this.navCtrl.navigateForward("/tabs/tab2");
  }

  async submitBooking() {

    const matchedBus = this.busData.find(bus => bus.residence === this.residence && bus.time === this.time);

    if (matchedBus && matchedBus.totalSeats > 0) {
      // Update totalSeats
      const updatedSeats = matchedBus.totalSeats - 1;
      try {
        await this.dataService.updateBusSeats(matchedBus.id, updatedSeats);

        const bookingRef = this.dataService.createBookingRef();
        // Add booking data
        const bookingData = {
          id: bookingRef.ref.id,
          time: this.time,
          residence: this.residence,
          busNumber: matchedBus.busNumber,
          email: this.userData.email,
          fullName: this.userData.fullName,
          studentNumber: this.userData.studentNumber, 
          message: this.message
        };

        await this.dataService.addBooking(bookingRef,bookingData);
        this.nav();
        console.log('Booking successfully added!');
        this.toast('Booking successfully added!','success');

      } catch (error) {
        console.error('Error updating bus seats or adding booking: ', error);
        this.toast('Error updating bus seats or adding booking:','danger');
      }
    } else {
      console.log('No available seats or bus not found');
      this.presentMessage('Notification','No available seats or bus not found');
    }
  }
  async toast(message:string,color:string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
       position: 'top'
    });
    toast.present();
    return;
  }
  async presentMessage(header: string ='Message', message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
