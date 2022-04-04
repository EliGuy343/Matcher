import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model:any = {};
  loggedIn:boolean;

  constructor(private accountService:AccountService) {
    this.loggedIn = false;
  }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: res=>{
        console.log(res);
        this.loggedIn = true;
      },
      error: error=>console.log(error) 
    })
  }

  logout() {
    this.loggedIn = false;
  }
}
