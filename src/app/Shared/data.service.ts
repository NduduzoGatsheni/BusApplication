import { Injectable } from '@angular/core';
import { AngularFirestore,  AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bus } from '../Mode/bus.model'; // Import your Bus model


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private busesCollection: AngularFirestoreCollection<Bus>;

 
  constructor(private firestore: AngularFirestore) {
    this.busesCollection = this.firestore.collection<Bus>('buses');
  }

  addBooking(data: any) {
    return this.firestore.collection('booked').add(data);
  }

  addBus(data: any) {
    return this.firestore.collection('buses').add(data);
  }

  getBuses(): Observable<Bus[]> {
    return this.busesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Bus;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
}


