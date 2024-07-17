import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { Observable } from 'rxjs';
import { Bus } from '../Mode/bus.model'; // Assuming you have a Bus model

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  buses$?: Observable<Bus[]>; // Optional chaining

  constructor(private dataService: DataService) { }

  ngOnInit() {
    if (!this.buses$) {
      this.fetchBuses();
    }
  }

  fetchBuses() {
    this.buses$ = this.dataService.getBuses();
  }
}
