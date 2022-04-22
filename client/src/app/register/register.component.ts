import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  registerForm!: FormGroup;

  constructor(private accountService: AccountService,
    private toastr:ToastrService, private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.initilazeForm();
  }

  initilazeForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required,
        Validators.minLength(8)]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]]
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control:AbstractControl) =>{
        if(control.parent == null)
          return null;
      return control?.value === (control?.parent?.controls as
        { [key: string]: AbstractControl })[matchTo].value ? null : { isMatching: true };
    }
  }
  register() {
    console.log(this.registerForm.value); 
    // this.accountService.register(this.model).subscribe({
    //   next: response => {
    //     console.log(response);
    //     this.cancel();
    //   },
    //   error: error => {
    //     console.log(error);
    //     this.toastError(error.error);
    //   }
    // })
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
