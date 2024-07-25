import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bus } from '../Mode/bus.model';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  buses: Bus[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const state = history.state;
    if (state && state.buses) {
      this.buses = state.buses;
    }
  }
  

  
  get allBusesHaveNoMessages(): boolean {
    return this.buses.every(bus => !bus.message);
  }


}
