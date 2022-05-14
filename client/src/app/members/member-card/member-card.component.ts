import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member!: Member; 
  liked: boolean = false;
  constructor(private membersService: MembersService,
      private toastr: ToastrService) {}

  ngOnInit(): void {

  }

  toggleLike(member: Member) {
    this.membersService.toggleLike(member.userName).subscribe(
      ()=>{
        if(this.liked)
          this.toastr.success("member has been liked");
        else 
          this.toastr.success("member has been unliked");
        this.liked = !this.liked;
      }
    );
  }
}
