import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { Observable } from 'rxjs';
import { Bus } from '../Mode/bus.model'; // Assuming you have a Bus model
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  providers: [DatePipe] 
})
export class DashboardPage implements OnInit {
  buses$?: Observable<Bus[]>;
  currentTime: string ='';

  // bus:Bus ={

  // }
  constructor(private dataService: DataService,private datePipe: DatePipe,private router: Router) { }

  ngOnInit() {
    if (!this.buses$) {
      this.fetchBuses();
    }
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

  navigateToUpdate(bus: Bus) {
    this.router.navigate(['/add-bus'], { state: { bus } });
  }
}
