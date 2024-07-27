import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { UserService } from '../Shared/user.service';
import { map, Observable } from 'rxjs';
import { Bus } from '../Mode/bus.model';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-all-buses',
  templateUrl: './all-buses.page.html',
  styleUrls: ['./all-buses.page.scss'],
})
export class AllBusesPage implements OnInit {

  busData$!: Observable<Bus[]>;
  busData: Bus[] = []; 
  bus: any;
  uid: any;
  busNumber: any;
  residence: any;
  time: any;
  totalSeats: any;

filteredBookings = [...this.busData];

  constructor(   private alertController: AlertController,private dataService: DataService,private userService: UserService, private router: Router) { }

ngOnInit() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state?.['bus']) {
      this.bus = navigation.extras.state['bus'];
      this.uid = this.bus.id;
      this.busNumber = this.bus.busNumber;
      this.residence = this.bus.residence;
      this.time = this.bus.time;
      this.totalSeats = this.bus.totalSeats;
    }

    this.fetchBookedData()

  }

    // fetchBookedData() {

    //   this.busData.splice(0, this.busData.length);

    // if (this.residence) {
    //   alert(this.residence);
    //   this.busData$ = this.dataService.getBookedDataByResidence(this.residence);
    //   this.busData$.subscribe(data => {
    //     this.busData = data;
    //   });
    // }
    // }
    fetchBookedData() {
          this.busData.splice(0, this.busData.length);
      
          if (this.residence) {
            this.busData$ = this.dataService.getBookedDataByResidence(this.residence);
            this.busData$.subscribe(data => {
              this.busData = data;
              this.filteredBookings = [...this.busData];
            });
          }
        }
    splitFullName(fullName: any): { firstName: string, lastName: string } {
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      return { firstName, lastName };
    }
  


filterBookings(event: any) {
  const searchTerm = event.target.value.toLowerCase();
  this.filteredBookings = this.busData.filter(booking => 
    booking.studentNumber == searchTerm ||
    booking.fullName?.toLowerCase().includes(searchTerm)
  );
}


//   deleteBus(bus: Bus) {
//     const index = this.busData.findIndex(b => b.id === bus.id);
//     if (index !== -1) {
//       this.busData.splice(index, 1);
//       this.filteredBookings = [...this.busData];
//     }
//   }
// }

async deleteBus(bus: Bus) {
  try {
    await this.dataService.deleteBus(bus.id);
    // Remove the bus from the local array
    this.busData = this.busData.filter(b => b.id !== bus.id);
    this.filteredBookings = this.filteredBookings.filter(b => b.id !== bus.id);
    this.userService.presentToast('Bus deleted successfully');

  } catch (error) {
    console.error('Error deleting bus:', error);
    this.userService.presentToast('Error deleting bus. Please try again.', 3000, 'top')
  }
}

async presentAlert(data:any) {
      const alert = await this.alertController.create({
        header: 'Delete Student Ticket',
        message: data.fullName,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Deletion cancelled');
            }
          },
          {
        text: 'Delete',
        cssClass: 'danger',
        // color:'red'
        handler: () => {
          this.deleteBus(data);
        }
          }
        ]
      });
  
      await alert.present();
    }


}


// loadMoreBookings(event:any) {
//   // Simulate loading more bookings
//   setTimeout(() => {
//     const newBookings = this.busData;
//     //  [
//     //   { studentNumber: '22022014', fullName: 'Alice Johnson', time: '10:00' },
//     //   { studentNumber: '22022015', fullName: 'Bob Williams', time: '10:00' },
//     // ];
//     this.busData.push(...newBookings);
//     this.filteredBookings = [...this.busData];
//     event.target.complete();

//     // Disable infinite scroll if all data is loaded
//     if (this.busData.length >= 50) {
//       event.target.disabled = true;
//     }
//   }, 1000);
// }
// }















//-------------------------from here-------------------
// import { Component, ViewChild, OnInit } from '@angular/core';
// import { IonInfiniteScroll, AlertController } from '@ionic/angular';


// @Component({
//   selector: 'app-all-buses',
//   templateUrl: './all-buses.page.html',
//   styleUrls: ['./all-buses.page.scss'],
// })
// export class AllBusesPage implements OnInit {

//   @ViewChild(IonInfiniteScroll)
//   // infiniteScroll!: IonInfiniteScroll;

//   title = 'MUT TO LONSDALE';
//   timeRange = '10:00 - 10:30';
//   busNumber = '';
//   bookings = [
//     { studentNumber: '22022011', name: 'Nkululeko Mgadi', time: '10:00 - 10:30' },
//     { studentNumber: '22022012', name: 'John Doe', time: '10:00 - 10:30' },
//     { studentNumber: '22022013', name: 'Jane Smith', time: '10:00 - 10:30' },
//   ];
//   filteredBookings = [...this.bookings];
//   page = 1;

//   constructor(private alertController: AlertController) {}
//   ngOnInit(){

//   }
    
  

//   editBusNumber() {
//     this.presentBusNumberAlert();
//   }

//   async presentBusNumberAlert() {
//     const alert = await this.alertController.create({
//       header: 'Edit Bus Number',
//       inputs: [
//         {
//           name: 'busNumber',
//           type: 'text',
//           placeholder: 'Enter bus number',
//           value: this.busNumber
//         }
//       ],
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel'
//         },
//         {
//           text: 'Save',
//           handler: (data) => {
//             this.busNumber = data.busNumber;
//           }
//         }
//       ]
//     });

//     await alert.present();
//   }

//   filterBookings(event: any) {
//     const searchTerm = event.target.value.toLowerCase();
//     this.filteredBookings = this.bookings.filter(booking => 
//       booking.studentNumber.toLowerCase().includes(searchTerm) ||
//       booking.name.toLowerCase().includes(searchTerm)
//     );
//   }

  // loadMoreBookings(event:any) {
  //   // Simulate loading more bookings
  //   setTimeout(() => {
  //     const newBookings = [
  //       { studentNumber: '22022014', name: 'Alice Johnson', time: '10:00 - 10:30' },
  //       { studentNumber: '22022015', name: 'Bob Williams', time: '10:00 - 10:30' },
  //     ];
  //     this.bookings.push(...newBookings);
  //     this.filteredBookings = [...this.bookings];
  //     event.target.complete();

  //     // Disable infinite scroll if all data is loaded
  //     if (this.bookings.length >= 50) {
  //       event.target.disabled = true;
  //     }
  //   }, 1000);
  // }

//   async addBooking() {
//     const alert = await this.alertController.create({
//       header: 'Add New Booking',
//       inputs: [
//         {
//           name: 'studentNumber',
//           type: 'text',
//           placeholder: 'Student Number'
//         },
//         {
//           name: 'name',
//           type: 'text',
//           placeholder: 'Name'
//         }
//       ],
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel'
//         },
//         {
//           text: 'Add',
//           handler: (data) => {
//             const newBooking = {
//               studentNumber: data.studentNumber,
//               name: data.name,
//               time: this.timeRange
//             };
//             this.bookings.unshift(newBooking);
//             this.filteredBookings = [...this.bookings];
//           }
//         }
//       ]
//     });

//     await alert.present();
//   }
// }

// --------------------ends here


























// import { Component, OnInit, ViewChild } from '@angular/core';
// import { DataService } from '../Shared/data.service';
// import { Observable } from 'rxjs';
// import { Bus } from '../Mode/bus.model';
// import { Router } from '@angular/router';
// import { IonInfiniteScroll, AlertController } from '@ionic/angular';

// @Component({
//   selector: 'app-all-buses',
//   templateUrl: './all-buses.page.html',
//   styleUrls: ['./all-buses.page.scss'],
// })
// export class AllBusesPage implements OnInit {
//   @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll | undefined;

//   busData$!: Observable<Bus[]>;
//   busData: Bus[] = [];
//   filteredBusData: Bus[] = [];
//   bus: any;
//   uid: any;
//   busNumber: any;
//   residence: any;
//   time: any;
//   totalSeats: any;
//   page = 1;

//   constructor(
//     private dataService: DataService, 
//     private router: Router,
//     private alertController: AlertController
//   ) { }

//   ngOnInit() {
//     const navigation = this.router.getCurrentNavigation();

//     if (navigation?.extras.state?.['bus']) {
//       this.bus = navigation.extras.state['bus'];
//       this.uid = this.bus.id;
//       this.busNumber = this.bus.busNumber;
//       this.residence = this.bus.residence;
//       this.time = this.bus.time;
//       this.totalSeats = this.bus.totalSeats;
//     }

//     this.fetchBookedData();
//   }

//   fetchBookedData() {
//     this.busData.splice(0, this.busData.length);

//     if (this.residence) {
//       this.busData$ = this.dataService.getBookedDataByResidence(this.residence);
//       this.busData$.subscribe(data => {
//         this.busData = data;
//         this.filteredBusData = [...this.busData];
//       });
//     }
//   }

//   filterBusData(event: any) {
//     const searchTerm = event.target.value.toLowerCase();
//     this.filteredBusData = this.busData.filter(bus => 
//       bus.busNumber.toLowerCase().includes(searchTerm) ||
//       bus.residence.toLowerCase().includes(searchTerm)
//     );
//   }

//   loadMoreBuses(event:any) {
//     // Simulate loading more buses
//     setTimeout(() => {
//       // Here you would typically fetch more data from your service
//       // For demonstration, we'll just add dummy data
//       const newBuses = [
//         { id: 'new1', busNumber: 'B001', residence: 'New Residence', time: '11:00', totalSeats: 50 },
//         { id: 'new2', busNumber: 'B002', residence: 'Another Residence', time: '12:00', totalSeats: 45 },
//       ];
//       this.busData.push(...newBuses);
//       this.filteredBusData = [...this.busData];
//       event.target.complete();

//       // Disable infinite scroll if all data is loaded
//       if (this.busData.length >= 50) {
//         event.target.disabled = true;
//       }
//     }, 1000);
//   }

//   async addBus() {
//     const alert = await this.alertController.create({
//       header: 'Add New Bus',
//       inputs: [
//         {
//           name: 'busNumber',
//           type: 'text',
//           placeholder: 'Bus Number'
//         },
//         {
//           name: 'residence',
//           type: 'text',
//           placeholder: 'Residence'
//         },
//         {
//           name: 'time',
//           type: 'time',
//           placeholder: 'Time'
//         },
//         {
//           name: 'totalSeats',
//           type: 'number',
//           placeholder: 'Total Seats'
//         }
//       ],
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel'
//         },
//         {
//           text: 'Add',
//           handler: (data) => {
//             const newBus: Bus = {
//               id: Date.now().toString(), // Generate a temporary ID
//               busNumber: data.busNumber,
//               residence: data.residence,
//               time: data.time,
//               totalSeats: data.totalSeats
//             };
//             this.busData.unshift(newBus);
//             this.filteredBusData = [...this.busData];
//             // Here you would typically call a service method to add the bus to your backend
//             // this.dataService.addBus(newBus);
//           }
//         }
//       ]
//     });

//     await alert.present();
//   }

//   async editBusNumber(bus: Bus) {
//     const alert = await this.alertController.create({
//       header: 'Edit Bus Number',
//       inputs: [
//         {
//           name: 'busNumber',
//           type: 'text',
//           value: bus.busNumber,
//           placeholder: 'New Bus Number'
//         }
//       ],
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel'
//         },
//         {
//           text: 'Save',
//           handler: (data) => {
//             const index = this.busData.findIndex(b => b.id === bus.id);
//             if (index !== -1) {
//               this.busData[index].busNumber = data.busNumber;
//               this.filteredBusData = [...this.busData];
//               // Here you would typically call a service method to update the bus in your backend
//               // this.dataService.updateBus(bus.id, { busNumber: data.busNumber });
//             }
//           }
//         }
//       ]
//     });

//     await alert.present();
//   }

//   deleteBus(bus: Bus) {
//     const index = this.busData.findIndex(b => b.id === bus.id);
//     if (index !== -1) {
//       this.busData.splice(index, 1);
//       this.filteredBusData = [...this.busData];
//       // Here you would typically call a service method to delete the bus from your backend
//       // this.dataService.deleteBus(bus.id);
//     }
//   }

//   splitFullName(fullName: string): { firstName: string, lastName: string } {
//     const nameParts = fullName.split(' ');
//     const firstName = nameParts[0] || '';
//     const lastName = nameParts.slice(1).join(' ') || '';
//     return { firstName, lastName };
//   }
// }