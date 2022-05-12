import { Component, OnInit } from '@angular/core';
import { Toast } from 'ngx-toastr';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { UserParams } from 'src/app/models/userParams';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members?: Member[];
  pagination?: Pagination;
  userParams?: UserParams;
  user?:User | null;
  genderList = [
    {value:'male', display:'Male', isSelected: false},
    {value:'female', display:'Female', isSelected: false},
    {value:'non-binary', display:'Non-Binary', isSelected: false},
    {value:'agender', display:'Agender', isSelected: false},
    {value:'genderfluid', display:'Gender-Fluid', isSelected: false}
  ];
  constructor(private memberService:MembersService,
    private accountService: AccountService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{
        this.user = user;
        if(user)
          this.userParams = new UserParams(user);
      })
    }

  ngOnInit(): void {
    this.loadMembers();
  }

  resetFilters() {
    if(this.user){
      this.userParams = new UserParams(this.user);
      for(let gender of this.genderList) {
        gender.isSelected = false;
      }
      this.loadMembers();
    }
    
  }

  onCheckChange(e: any) {
    if(e.target.checked) {
      if(this.userParams && this.userParams.gender)
        this.userParams.gender[e.target.value] = e.target.value;
      else {
        this.userParams!.gender = {};
        this.userParams!.gender[e.target.value] = e.target.value;
      }
    }
    else{
      delete this.userParams!.gender[e.target.value];
    }
  }

  loadMembers() {
    if(this.userParams)
      this.memberService.getMembers(this.userParams).subscribe(response => {
        this.members = response.result;
        this.pagination = response.pagination;
    })
  }

  pageChanged(event: any) {
    if(this.userParams) {
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
