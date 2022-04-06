import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  model:any = {}; 

  constructor(private accountService: AccountService,
    private toastr:ToastrService) { }

  ngOnInit(): void {}

  register() { 
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => {
        console.log(error);
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

  cancel() {
    this.cancelRegister.emit(false);  
  }
}
