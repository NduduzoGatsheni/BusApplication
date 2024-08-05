import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bus } from '../Mode/bus.model';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  buses: Bus[] = [];

  announcement: string ='';
  constructor(private route: ActivatedRoute,
    private toastController:  ToastController,
    private firestore:  AngularFirestore 
  ) { }

  ngOnInit() {
    const state = history.state;
    if (state && state.buses) {
      this.buses = state.buses;
    }
    this.announcements();
  }
  
  announcements() {
    this.firestore.collection("Announcement").doc("announcement4all").valueChanges().subscribe((data: any) => {
      if (data) {
        this.announcement = data.announcement;
        this.toast(this.announcement,'warning');
      }
    });
  }
  
  get allBusesHaveNoMessages(): boolean {
    return this.buses.every(bus => !bus.message);
  }
  async toast(message:string,color:string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
    return;
  }

}
