import { Component } from '@angular/core';
import { UserService } from '../Shared/user.service';
import { DataService } from '../Shared/data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userData: any = {};

  constructor(private userService: UserService) {}

  async ngOnInit() {
    const email = this.userService.getCurrentUserEmail();
    if (email) {
      this.userData = await this.userService.getUserData(email);
    }
  }
}
