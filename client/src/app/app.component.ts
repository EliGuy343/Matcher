import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Matcher';
  users: any; 
  url = 'https://localhost:7260';
  constructor(private http:HttpClient) {}
  ngOnInit() {
    this.getUsers(); 
  }

  getUsers() {
    this.http.get(this.url +'/api/users').subscribe({
      next:(response?:any) => this.users=response,
      error:(error?:any) => console.log(error),
  });
  }
}
