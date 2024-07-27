import { Injectable } from '@angular/core';
import { AngularFirestore,  AngularFirestoreCollection, QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bus } from '../Mode/bus.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  presentToast(arg0: string) {
    throw new Error('Method not implemented.');
  }

  private busesCollection: AngularFirestoreCollection<Bus>;

  constructor(private firestore: AngularFirestore) {
    this.busesCollection = this.firestore.collection<Bus>('buses');
  }
  createBookingRef() {
    return this.firestore.collection('booked').doc(); // Generates a unique document reference
  }
  // addBooking(data: any) {
  //   return this.firestore.collection('booked').add(data);
  // }
 async addBooking(bookingRef: any, bookingData: any) {
    return bookingRef.set(bookingData);
  }


  deleteBus(busId: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.collection('booked').doc(busId).delete()
        .then(() => {
          console.log('Bus successfully deleted');
          resolve();
        })
        .catch((error) => {
          console.error('Error deleting bus: ', error);
          reject(error);
        });
    });
  }

  updateBusSeats(busId: string, seats: number) {
    return this.firestore.collection('buses').doc(busId).update({ totalSeats: seats });
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

  getTicketData() {
    return this.firestore.collection('booked').snapshotChanges();
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
  Announcement(announcement: string): Promise<void> {
    if (!announcement) {
      throw new Error('There is no announcement');
    }
    return this.firestore.collection("Announcement").doc('announcement4all').update({
      announcement: announcement,
    });
  }

  updateBusTime(busId: string, newTime: string) {
    return this.firestore
      .collection('buses')
      .doc(busId)
      .update({ time: newTime });
  }

  getBookedDataByResidence(residence: string): Observable<Bus[]> {
    return this.firestore.collection('booked', ref => ref.where('residence', '==', residence))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Bus;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
  }
}
