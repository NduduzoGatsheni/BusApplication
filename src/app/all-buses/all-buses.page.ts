import { Component, OnInit } from '@angular/core';
import { DataService } from '../Shared/data.service';
import { map, Observable } from 'rxjs';
import { Bus } from '../Mode/bus.model';

@Component({
  selector: 'app-all-buses',
  templateUrl: './all-buses.page.html',
  styleUrls: ['./all-buses.page.scss'],
})
export class AllBusesPage implements OnInit {

  busData$!: Observable<Bus[]>;
  busData: Bus[] = []; 

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.fetchBusData();
  }

  fetchBusData() {
    this.busData$ = this.dataService.getTicketData().pipe(
      map((actions: any[]) => actions.map((a: { payload: { doc: { data: () => Bus; id: any; }; }; }) => {
        const data = a.payload.doc.data() as Bus;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.busData$.subscribe(data => {
      this.busData = data;
    });
  }

}
