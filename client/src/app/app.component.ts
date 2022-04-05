import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Matcher';
  users: any; 
  url = 'https://localhost:7260';

  constructor(private accountService:AccountService) {}
  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userItem = localStorage.getItem('user');
    const user: User = userItem ? JSON.parse(userItem) : null;
    this.accountService.setCurrentUser(user);
  }


}
