import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { AccountService } from './services/account.service';
import { PresenceService } from './services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Matcher';
  users: any; 
  url = 'https://localhost:7260';

  constructor(
    private accountService:AccountService,
    private presence:PresenceService) {}
    
  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userItem = localStorage.getItem('user');
    const user: User = userItem ? JSON.parse(userItem) : null;
    if(user) {
      this.accountService.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }
  }


}
