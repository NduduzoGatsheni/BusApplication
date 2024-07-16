import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: AngularFirestore) {}

  addBooking(data: any) {
    return this.firestore.collection('booked').add(data);
  }

  addBus(data: any) {
    return this.firestore.collection('buses').add(data);
  }
}
