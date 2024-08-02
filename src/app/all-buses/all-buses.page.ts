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
  let searchTermNumber = 0;
  if (!isNaN(searchTerm) && searchTerm.trim() !== '') {
      searchTermNumber = Number(searchTerm);
  }
  this.filteredBookings = this.busData.filter(booking => 
    booking?.studentNumber === searchTermNumber ||
    booking.fullName?.toLowerCase().includes(searchTerm)
  );
}

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

async presentAlert(data: any) {
  const alert = await this.alertController.create({
    header: 'Delete Student Ticket',
    message: data.fullName,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'cancel-button',
        handler: () => {
          console.log('Deletion cancelled');
        }
      },
      {
        text: 'Delete',
        cssClass: 'danger-button',
        handler: () => {
          this.deleteBus(data);
        }
      }
    ]
  });
  await alert.present();
}



async present() {
  const alert = await this.alertController.create({
    header: 'Make An Announcement',
    inputs: [
      {
        name: 'alertMessage',
        type: 'text',
        placeholder: 'Enter your announcement message',
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Alert canceled');
        },
      },
      {
        text: 'Submit',
        handler: (data) => {
          this.submitAnnouncement(data.alertMessage,this.bus.residence);
          console.log('Alert message:', data.alertMessage);
        },
      },
    ],
  });
  await alert.present();
}

// submitAnnouncement(alertMessage: string,residence: string) {
//   if (alertMessage) {
//     this.dataService.updateBusMessage(alertMessage,residence)
//     .then(() => {
//         console.log('Announcement updated successfully');
//       }) 
//       .catch((error:any) => {
//         console.error('Error updating announcement:', error);
//       });
//   } else {
//     console.error('Announcement message is empty');
//   }
// }
// submitAnnouncement(alertMessage: string, residence: string) {
//   if (alertMessage) {
//     // Query all records with the specified residence
//     this.dataService.getRecordsByResidence(residence)
//       .then((records: any[]) => {
//         const updatePromises = records.map(record => {
//           return this.dataService.updateBusMessage(record.id, alertMessage)
//             .then(() => {
//               console.log(`Announcement updated successfully for record ID: ${record.id}`);
//             })
//             .catch((error: any) => {
//               console.error(`Error updating announcement for record ID: ${record.id}`, error);
//             });
//         });
//         return Promise.all(updatePromises);
//       })
//       .then(() => {
//         console.log('All announcements updated successfully');
//       })
//       .catch((error: any) => {
//         console.error('Error updating announcements:', error);
//       });
//   } else {
//     console.error('Announcement message is empty');
//   }
// }

submitAnnouncement(alertMessage: string, residence: string) {
  if (alertMessage) {
    // Update message in buses collection
    this.dataService.updateBusesCollection(alertMessage, residence)
      .then(() => {
        // Update message in booked collection
        return this.dataService.updateBookedCollection(alertMessage, residence);
      })
      .then(() => {
        console.log('All announcements updated successfully in both collections');
      })
      .catch((error: any) => {
        console.error('Error updating announcements:', error);
      });
  } else {
    console.error('Announcement message is empty');
  }
}


}