import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {Observable } from 'rxjs';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model:any = {};


  constructor(public accountService:AccountService,
    private router:Router, private toastr:ToastrService) {}
  
  ngOnInit(): void {}

  login() {
    this.accountService.login(this.model).subscribe({
      next: res=>{
        this.router.navigateByUrl("/members");
      },
      error: error=> {
        this.toastError(error.error);
      } 
    })
  }

  toastError(error: any) {
    if(typeof(error) === 'string') {
      this.toastr.error(error);
    }
    else {
      for(let item of Object.keys(error.errors)){
        this.toastr.error(error.errors[item]);
      }
    }
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }

}
