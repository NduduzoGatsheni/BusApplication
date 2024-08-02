import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bus } from '../Mode/bus.model';
import { DataService } from '../Shared/data.service';
import { UserService } from '../Shared/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  busData$!: Observable<Bus[]>;
  busData: Bus[] = []; 
  currentUserEmail!: string;

  constructor(
    private dataService: DataService,
    private userService: UserService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.currentUserEmail = this.userService.getCurrentUserEmail();
    if (this.currentUserEmail) {
      this.fetchBusData();
    }
  }
  cancelBooking(uid?:string){
    
    if(uid){
       this.dataService.cancelBooking(uid);
    }
    else{
      alert('Delete was unsuccessfully');
    }
  }

  async presentAlert(uid?:string) {
    const alert = await this.alertController.create({
      header: 'Cancel Ride',
      message: 'Are you sure you want to cancel the ride',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Deletion cancelled');
          }
        },
        {
          text: 'Yes',
          cssClass: 'danger-button',
          handler: () => {
            this.cancelBooking(uid);
          }
        }
      ]
    });
    await alert.present();
  }
  fetchBusData() {
    this.busData$ = this.dataService.getTicketData().pipe(
      map((actions: any[]) => actions.map((a: { payload: { doc: { data: () => Bus; id: any; }; }; }) => {
        const data = a.payload.doc.data() as Bus;
        const id = a.payload.doc.id;
        return { id, ...data };
      })),
      map((buses: Bus[]) => buses.filter(bus => bus.email === this.currentUserEmail)) // Filter by current user email
    );

    this.busData$.subscribe(data => {
      this.busData = data;
      alert(JSON.stringify(this.busData));
    });
  }
}
