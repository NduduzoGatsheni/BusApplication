

// import { Router } from '@angular/router'; 

// import { Component, OnInit } from '@angular/core';
// import { DataService } from '../Shared/data.service';
// import { Observable, Subject, of } from 'rxjs';
// import { Bus } from '../Mode/bus.model';
// import { DatePipe } from '@angular/common';
// // import { Router } from '@angular/router';
// import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
// import { AlertController } from '@ionic/angular';

// @Component({
//   selector: 'app-tab1',
//   templateUrl: 'tab1.page.html',
//   styleUrls: ['tab1.page.scss'],
//   providers: [DatePipe] 
// })
// export class Tab1Page {
  
//   searchQuery: string = '';
//   private searchTerms = new Subject<string>();

//   // buses$?: Observable<Bus[]>; 
//   buses$: Observable<Bus[]> = of([]);  
//   currentTime: string ='';

//   constructor(private dataService: DataService, private datePipe: DatePipe,  private router: Router) {
//   }

//   ngOnInit() {
//     this.fetchBuses();
//     setInterval(() => {
//       this.updateCurrentTime();
//     }, 1000);

 

  
//   this.searchTerms.pipe(
//     debounceTime(300), // wait for 300ms pause in events
//     distinctUntilChanged(), // ignore if next search term is same as previous
//     switchMap((term: string) => this.searchBusesInArray(term)) // switch to new observable each time the term changes
//   ).subscribe(filteredBuses => {
//     this.buses$ = of(filteredBuses); // update the buses$ observable with filtered data
//   });
// }


// clearSearch() {
//   this.searchQuery = '';
//   this.fetchBuses();
// }

// onSearch() {
//   this.searchTerms.next(this.searchQuery.trim()); 
// }

// searchBusesInArray(residence: string): Observable<Bus[]> {
//   if (residence.trim() === '') {
//     // If the search term is empty, return the original buses$
//     return this.buses$;
//   } else {
//     // Filter based on residence
//     return this.buses$.pipe(
//       map((buses: Bus[]) =>
//         buses.filter(bus =>
//           bus.residence.toLowerCase().includes(residence.toLowerCase())
//         )
//       )
//     );
//   }
// }

//   updateCurrentTime() {
//     this.currentTime = this.datePipe.transform(new Date(), 'shortTime') || '';
//   }
//   fetchBuses() {
//     this.buses$ = this.dataService.getBuses();
//   }

//   navigateTobooking(bus: Bus) {
//     this.router.navigate(['/book'], { state: { bus } });
//   }

//   navigateToNotifications(buses: Bus[]) {
//     this.router.navigate(['/notifications'], { state: { buses } });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { Observable, Subject, of } from 'rxjs';
import { Bus } from '../Mode/bus.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { UserService } from '../Shared/user.service';
// import { DataService } from '../Shared/data.service';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [DatePipe]
})
export class Tab1Page implements OnInit {
  userData: any = {};
  searchQuery: string = '';
  private searchTerms = new Subject<string>();

  buses$: Observable<Bus[]> = of([]);
  currentTime: string = '';
  allBuses: Bus[] = []; // Store the array here
  announcement:string='';
  constructor(
    private dataService: DataService, 
    private datePipe: DatePipe,  
    private router: Router,
    private userService: UserService,
    private alertController: AlertController,
    private toastController: ToastController,
    private firestore: AngularFirestore
  ) {}

  async ngOnInit() {
    const email = this.userService.getCurrentUserEmail();
    this.announcements();

    if (email) {
      this.userData = await this.userService.getUserData(email);
    }
    this.fetchBuses();
    setInterval(() => {
      this.updateCurrentTime();
    }, 1000);

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchBusesInArray(term))
    ).subscribe(filteredBuses => {
      this.buses$ = of(filteredBuses);
      this.allBuses = filteredBuses; // Store filtered buses
    });
  }
  announcements() {
    this.firestore.collection("Announcement").doc("announcement4all").valueChanges().subscribe((data: any) => {
      if (data) {
        this.announcement = data.announcement;
        if(this.announcement){
          this.toast(this.announcement,'warning');
        }
        
      }
    });
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
      return this.buses$;
    } else {
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
    this.dataService.getBuses().subscribe(buses => {
      this.buses$ = of(buses);
      this.allBuses = buses; // Initialize allBuses
    });
  }

  navigateTobooking(bus: Bus) {
    this.router.navigate(['/book'], { state: { bus } });
  }

  navigateToNotifications() {
    this.router.navigate(['/notifications'], { state: { buses: this.allBuses } });
  }

  async presentMessage(header: string ='Message', message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
  async toast(message:string,color:string){
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      color: color,
      position: 'middle'
    });
    toast.present();
    return;
  }

}
