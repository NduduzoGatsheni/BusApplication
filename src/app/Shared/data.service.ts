import { Injectable } from '@angular/core';
import { AngularFirestore,  AngularFirestoreCollection, QueryFn } from '@angular/fire/compat/firestore';
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
  getBusData() {
    return this.firestore.collection('buses').snapshotChanges();
  }

  addStudent(data: any) {
    return this.firestore.collection('registeredStudents').add(data);
  }
  addProfile(data: any) {
    return this.firestore.collection('students').add(data);
  }

  addBus(bus: Bus): Promise<void> {
    const id = this.firestore.createId();
    return this.busesCollection.doc(id).set({ ...bus, id });
  }

  addOrUpdateLocation(location: string): Promise<void> {
    const uid = "HWNucqq8dYD4H5gCp5V8";
    const locationRef = this.firestore.collection('Location').doc(uid); 
    return locationRef.set({ location }, { merge: true });
  }

  updateBus(bus: Bus): Promise<void> {
    if (!bus.id) {
      throw new Error('Bus ID is required to update');
    }
    return this.busesCollection.doc(bus.id).update(bus);
  }

  getLocation(): Observable<string> {
    // Replace 'locationId' with your actual document ID or logic to retrieve the location
    return this.firestore.collection('Location').doc('HWNucqq8dYD4H5gCp5V8').valueChanges()
      .pipe(
        map((location: any) => location?.location as string)
      );
  }

  // searchBuses(searchTerm: string): Observable<Bus[]> {
  //   const queryFn: QueryFn = ref => ref.where('residence', '>=', searchTerm).where('name', '<=', searchTerm + '\uf8ff');
  //   return this.firestore.collection<Bus>('Buses', queryFn).valueChanges();
  // }



  // searchBusesInArray(residence: string): Observable<Bus[]> {
  //   return this.firestore.collection<Bus>('Buses', ref =>
  //     ref.where('buses$', 'array-contains', { residence })
  //   ).valueChanges();
  // }
}