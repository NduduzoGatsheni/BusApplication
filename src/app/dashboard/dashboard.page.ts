
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
  buses$: Observable<Bus[]> = of([]); // Option 1: Initialize with an empty observable
  currentTime: string = '';
  location: string = '';
  searchQuery: string = '';
  private searchTerms = new Subject<string>();

  constructor(private dataService: DataService, private datePipe: DatePipe, private router: Router,private alertController: AlertController) { }

  ngOnInit() {
    this.fetchBuses(); // Fetch buses initially

    setInterval(() => {
      this.updateCurrentTime();
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
            // Handle the alert message as needed
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
    this.searchTerms.next(this.searchQuery.trim()); // emit search term to searchTerms Subject
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
    this.buses$ = this.dataService.getBuses() as Observable<Bus[]>; // Option 2: Assert type using 'as'
  }

  navigateToUpdate(bus: Bus) {
    this.router.navigate(['/add-bus'], { state: { bus } });
  }

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
}
