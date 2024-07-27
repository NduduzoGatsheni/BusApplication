
// import { Component, OnInit } from '@angular/core';
// import { DataService } from '../Shared/data.service';
// import { Observable, Subject, of } from 'rxjs';
// import { Bus } from '../Mode/bus.model';
// import { DatePipe } from '@angular/common';
// import { Router } from '@angular/router';
// import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
// import { AlertController } from '@ionic/angular';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.page.html',
//   styleUrls: ['./dashboard.page.scss'],
//   providers: [DatePipe] 
// })
// export class DashboardPage implements OnInit {
//   buses$: Observable<Bus[]> = of([]); // Option 1: Initialize with an empty observable
//   currentTime: string = '';
//   location: string = '';
//   searchQuery: string = '';
//   private searchTerms = new Subject<string>();

//   constructor(private dataService: DataService, private datePipe: DatePipe, private router: Router,private alertController: AlertController) { }

//   ngOnInit() {



//     this.fetchBuses(); // Fetch buses initially

//     setInterval(() => {
//       this.updateCurrentTime();
//     }, 1000);

//     this.dataService.getLocation().subscribe(location => {
//       this.location = location; 
//     });

//     // Subscribe to search terms
//     this.searchTerms.pipe(
//       debounceTime(300), // wait for 300ms pause in events
//       distinctUntilChanged(), // ignore if next search term is same as previous
//       switchMap((term: string) => this.searchBusesInArray(term)) // switch to new observable each time the term changes
//     ).subscribe(filteredBuses => {
      
//       this.buses$ = of(filteredBuses); // update the buses$ observable with filtered data
//     });
//   }

//   async presentAlert() {
//     const alert = await this.alertController.create({
//       header: 'Make An Announcement',
//       inputs: [
//         {
//           name: 'alertMessage',
//           type: 'text',
//           placeholder: 'Enter your announcement message',
//         },
//       ],
//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel',
//           cssClass: 'secondary',
//           handler: () => {
//             console.log('Alert canceled');
//           },
//         },
//         {
//           text: 'Submit',
//           handler: (data) => {
//             this.submitAnnouncement(data.alertMessage);
//             console.log('Alert message:', data.alertMessage);
//             // Handle the alert message as needed
//           },
//         },
//       ],
//     });

//     await alert.present();
//   }
//   clearSearch() {
//     this.searchQuery = '';
//     this.fetchBuses();
// }
//   onSearch() {
//     this.searchTerms.next(this.searchQuery.trim()); // emit search term to searchTerms Subject
//   }

//   searchBusesInArray(residence: string): Observable<Bus[]> {
//     if (residence.trim() === '') {
//       // If the search term is empty, return the original buses$
//       return this.buses$;
//     } else {
//       // Filter based on residence
//       return this.buses$.pipe(
//         map((buses: Bus[]) =>
//           buses.filter(bus =>
//             bus.residence.toLowerCase().includes(residence.toLowerCase())
//           )
//         )
//       );
//     }
//   }
  
//   updateCurrentTime() {
//     this.currentTime = this.datePipe.transform(new Date(), 'shortTime') || '';
//   }

//   fetchBuses() {
//     this.buses$ = this.dataService.getBuses() as Observable<Bus[]>; // Option 2: Assert type using 'as'
//   }

//   navigateToUpdate(bus: Bus) {
//     this.router.navigate(['/add-bus'], { state: { bus } });
//   }

//   onChange(location: string): void {
//     this.dataService.addOrUpdateLocation(location).then(() => {
//       console.log('Location added or updated successfully');
//     }).catch(error => {
//       console.error('Error adding or updating location:', error);
//     });
//   }
//   submitAnnouncement(alertMessage: string) {
//     if (alertMessage) {
//       this.dataService.Announcement(alertMessage)
//         .then(() => {
//           console.log('Announcement updated successfully');
//         })
//         .catch((error) => {
//           console.error('Error updating announcement:', error);
//         });
//     } else {
//       console.error('Announcement message is empty');
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { Observable, Subject, of } from 'rxjs';
import { Bus } from '../Mode/bus.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  providers: [DatePipe]
})
export class DashboardPage implements OnInit {
  buses$: Observable<Bus[]> = of([]); 
  currentTime: string = '';
  location: string = '';
  searchQuery: string = '';
  private searchTerms = new Subject<string>();

  constructor(
    private dataService: DataService,
    private datePipe: DatePipe,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.fetchBuses();

    setInterval(() => {
      this.updateCurrentTime();
      // this. checkAndUpdateBusTimes1() ;
      // this.checkAndUpdateBusTimes2();
    }, 1000);

    this.dataService.getLocation().subscribe(location => {
      this.location = location;
    });

    // Subscribe to search terms
    this.searchTerms.pipe(
      debounceTime(300), // wait for 300ms pause in events
      distinctUntilChanged(), // ignore if next search term is same as previous
      switchMap((term: string) => this.searchBusesInArray(term)) // switch to new observable each time the term changes
    ).subscribe(filteredBuses => {
      this.buses$ = of(filteredBuses); // update the buses$ observable with filtered data
    });
  }

  async presentAlert() {
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
            this.submitAnnouncement(data.alertMessage);
            console.log('Alert message:', data.alertMessage);
          },
        },
      ],
    });

    await alert.present();
  }

  clearSearch() {
    this.searchQuery = '';
    this.fetchBuses();
  }

  onSearch() {
    this.searchTerms.next(this.searchQuery.trim()); 
  }

  searchBusesInArray(residence: string): Observable<Bus[]> {
    if (residence.trim() === '') {
      // If the search term is empty, return the original buses$
      return this.buses$;
    } else {
      // Filter based on residence
      return this.buses$.pipe(
        map((buses: Bus[]) =>
          buses.filter(bus =>
            bus.residence.toLowerCase().includes(residence.toLowerCase())
          )
        )
      );
    }
  }

  updateCurrentTime() {
    this.currentTime = this.datePipe.transform(new Date(), 'shortTime') || '';
  }

  fetchBuses() {
    this.buses$ = this.dataService.getBuses();
  }

  // checkAndUpdateBusTimes() {
  //   const timeUpdates: { [key: string]: string } = {
  //     '6:20 AM': '07:00 AM',
  //     '7:20 AM': '08:00 AM',
  //     '8:20 AM': '09:00 AM',
  //     '9:20 AM': '10:30 AM',
  //     '10:50 AM': '12:30 PM',
  //     '3:51 PM': '15:00 PM',
  //   };
  
  //   this.buses$.subscribe(buses => {
  //     buses.forEach(bus => {
  //       if (bus.id && bus.residence.endsWith('MUT')) {
  //         const newTime = timeUpdates[this.currentTime as keyof typeof timeUpdates];
  
  //         if (newTime) {
  //           this.dataService.updateBusTime(bus.id, newTime).then(() => {
  //             console.log(`Bus with ID ${bus.id} time updated to ${newTime}`);
  //           }).catch(error => {
  //             console.error(`Error updating bus time for ID ${bus.id}:`, error);
  //           });
  //         }
  //       }
  //     });
  //   });
  // }
  

  checkAndUpdateBusTimes1() {
    const timeUpdates: { [key: string]: string } = {
      '6:20 AM': '07:00 AM',
      '7:20 AM': '08:00 AM',
      '8:20 AM': '09:00 AM',
      '9:20 AM': '10:30 AM',
      '10:50 AM': '12:30 PM',
      '3:13 PM': '15:00 PM',
    };
    // this.dataService.updateBusTimes(timeUpdates, this.currentTime);
    this.updateEvent(timeUpdates, this.currentTime, 'MUT -');
  }
  // Specific function for the second set of time updates
  checkAndUpdateBusTimes2() {
    const timeUpdates: { [key: string]: string } = {
      '9:20 AM': '10:00 AM',
      '11:20 AM': '12:00 PM',
      '1:20 PM': '14:00 PM',
      '3:17 PM': '17:00 PM',
      '5:20 PM': '19:00 PM',
      '7:20 PM': '21:00 PM'
    };
    // this.dataService.updateBusTimes(timeUpdates, this.currentTime);
    this.updateEvent(timeUpdates, this.currentTime,'- MUT');
  }


  updateEvent(timeMappings: { [key: string]: string }, currentTime: string, location: string): void {
    this.buses$.subscribe(buses => {
      buses.forEach(bus => {
        if (bus.id && bus.residence.endsWith(location)) {
          const newTime = timeMappings[currentTime];

          if (newTime) {
            this.dataService.updateBusTime(bus.id, newTime).then(() => {
              console.log(`Bus with ID ${bus.id} time updated to ${newTime}`);
            }).catch(error => {
              console.error(`Error updating bus time for ID ${bus.id}:`, error);
            });
          } else {
            console.error(`No time update found for current time ${currentTime}`);
          }
        }
      });
    });
  }



  // updateEvent(timeMappings: { [key: string]: string }) {
  //     return this.buses$.subscribe(buses => {
  //       buses.forEach(bus => {
  //         if (bus.id && bus.residence.endsWith('MUT')) {
  //           const newTime = timeMappings[this.currentTime];
  
  //           if (newTime) {
  //             this.dataService.updateBusTime(bus.id, newTime).then(() => {
  //               console.log(`Bus with ID ${bus.id} time updated to ${newTime}`);
  //             }).catch(error => {
  //               console.error(`Error updating bus time for ID ${bus.id}:`, error);
  //             });
  //           } else {
  //             console.error(`No time update found for current time ${this.currentTime}`);
  //           }
  //         }
  //       });
  //     });
  //   }
  // navigateToUpdate(bus: Bus) {
  //   this.router.navigate(['/add-bus'], { state: { bus } });
  // }

  onChange(location: string): void {
    this.dataService.addOrUpdateLocation(location).then(() => {
      console.log('Location added or updated successfully');
    }).catch(error => {
      console.error('Error adding or updating location:', error);
    });
  }

  submitAnnouncement(alertMessage: string) {
    if (alertMessage) {
      this.dataService.Announcement(alertMessage)
        .then(() => {
          console.log('Announcement updated successfully');
        })
        .catch((error) => {
          console.error('Error updating announcement:', error);
        });
    } else {
      console.error('Announcement message is empty');
    }
  }




  async navigate(bus: any) {
    const alert = await this.alertController.create({
      header: 'Details Options',
      buttons: [
        {
          text: 'Update Details',
          cssClass: 'update-details-button',
          handler: () => {
            this.updateBus(bus);
          }
        },
        {
          text: 'View Bookings',
          cssClass: 'view-bookings-button',
          handler: () => {
            this.viewStudents(bus);
          }
        }
      ]
    });
    await alert.present();
  
    // Apply CSS to insert icons
    this.addIconsToAlertButtons();
  }
  
  addIconsToAlertButtons() {
    const updateButton = document.querySelector('.update-details-button');
    const viewButton = document.querySelector('.view-bookings-button');
  
    if (updateButton) {
      updateButton.innerHTML = '<ion-icon style="color:green;" name="create-outline"></ion-icon><span style="color:green;"> Update Details</span>';
    }
  
    if (viewButton) {
      viewButton.innerHTML = '<ion-icon style="color:orangered;margin-right:5px;" name="eye-outline"></ion-icon><span style="color:orangered;font-weight:lighter;">View Bookings<span>';
    }
  }
  

  updateBus(bus: any) {
    this.router.navigate(['/add-bus'], { state: { bus } });
    console.log('Update Bus:', bus);
  }

  viewStudents(bus: any) {
    this.router.navigate(['/bookings'], { state: { bus } });
    console.log('View Students:', bus);
  }
}
