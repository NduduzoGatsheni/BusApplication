import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Bus } from '../Mode/bus.model';

@Injectable({
  providedIn: 'root',
})
export class TimeServiceService {
  currentTime: string = '';

  constructor(
    private datePipe: DatePipe,
    private firestore: AngularFirestore
  ) {
    this.updateCurrentTime();
    setInterval(() => this.updateCurrentTime(), 60000); // Update every minute
  }

  updateCurrentTime() {
    this.currentTime = this.datePipe.transform(new Date(), 'shortTime') || '';
  }

  fetchBuses(): Observable<Bus[]> {
    return this.firestore.collection<Bus>('buses').valueChanges();
  }

  updateBusTime(bus: Bus) {
    return this.firestore
      .collection('buses')
      .doc(bus.id)
      .update({ time: 'updated time' }); // Replace 'updated time' with the actual new time
  }

  checkAndUpdateBusTimes(buses: Bus[]) {
    buses.forEach((bus) => {
      if (bus.time === this.currentTime) {
        this.updateBusTime(bus);
      }
    });
  }
}
