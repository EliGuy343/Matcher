import { HttpClient } from '@angular/common/http';
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

  constructor(private http:HttpClient, private accountService:AccountService) {}
  ngOnInit() {
    this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userItem = localStorage.getItem('user');
    const user: User = userItem ? JSON.parse(userItem) : null;
    this.accountService.setCurrentUser(user);
  }

  getUsers() {
    this.http.get(this.url +'/api/users').subscribe({
      next:(response?:any) => this.users=response,
      error:(error?:any) => console.log(error),
  });
  }
}
