// import { Component } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { Observable } from 'rxjs';
import { Bus } from '../Mode/bus.model'; // Assuming you have a Bus model
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [DatePipe] 
})
export class Tab1Page {
  
  
  buses$?: Observable<Bus[]>; // Optional chaining
  currentTime: string ='';

  constructor(private dataService: DataService, private datePipe: DatePipe) {
    // this.currentTime = this.datePipe.transform(new Date(), 'shortTime');
  }
  // constructor(private dataService: DataService) { }

  ngOnInit() {

      this.fetchBuses();
    

    setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
  }

  updateCurrentTime() {
    this.currentTime = this.datePipe.transform(new Date(), 'shortTime') || '';
  }
  fetchBuses() {
    this.buses$ = this.dataService.getBuses();
  }
}
