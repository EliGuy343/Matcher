import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  maxDate!: Date;

  constructor(private accountService: AccountService,
    private toastr:ToastrService, private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.initilazeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initilazeForm() {
    this.registerForm = this.fb.group({
      gender:['male'],
      username: ['', Validators.required],
      knownAs:['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city:['', Validators.required],
      country:['', Validators.required],
      password: ['', [Validators.required,Validators.minLength(8),
        this.matchLowercase(), this.matchUppercase(), this.matchNumber()]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]]
    });
  }

  matchLowercase():ValidatorFn {
    return (control: AbstractControl)=>{
      const inp = control.value.toString();
      for(let i = 0; i < inp.length; i++) {
        if(inp[i].toLowerCase() == inp[i])
          return null; 
      }
      return {noLowercase: true}
    }
  }

  matchUppercase():ValidatorFn {
    return (control: AbstractControl)=>{
      const inp = control.value.toString();
      for(let i = 0; i < inp.length; i++) {
        if(inp[i].toUpperCase() == inp[i])
          return null; 
      }
      return {noUppercase: true}
    }
  }
  matchNumber():ValidatorFn {
    return (control: AbstractControl)=>{
      const inp = control.value.toString();
      for(let i = 0; i < inp.length; i++) {
        if(!isNaN(inp[i]))
          return null; 
      }
      return {noNumber: true}
    }
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
