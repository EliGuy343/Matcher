import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm!: NgForm;
  radioChanged: boolean = false;
  member: Member| null = null;
  user: User| null = null;
  @HostListener('window:beforeunload', ['$event']) unloadNotfication($event: any) {
    if(this.editForm.dirty || this.radioChanged) {
      $event.returnValue = true; 
    }
  }
  constructor(private accountService:AccountService,
    private toastr:ToastrService, private memberService:MembersService) {    
      this.accountService.currentUser$.pipe(take(1)).subscribe(
        user=>this.user=user
      );
    }
  
  ngOnInit(): void {
    this.loadMember();
  }

  radioChange() {
    this.radioChanged = true;
  }

  loadMember() {
    this.memberService.getMember(this.user!.userName)?.subscribe(
      member=> this.member = member
    );
  }

  updateMember() {
    if(!this.member){
      this.toastr.error("Error with member update");
      return;
    }
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success('profile updated successfully');
      this.editForm.reset(this.member);
      }  
    ) 
  }
}
