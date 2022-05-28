import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { MembersService } from 'src/app/services/members.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @ViewChild('messageForm') messageForm!: NgForm;
  @Input() messages !:Message[];
  @Input() username !:string;
  @Input() liked !: boolean;
  likedBy !:boolean;
  messageContent!: string;
  constructor(private messageSerivce: MessageService, 
    private memberService: MembersService) {}

  ngOnInit(): void {
    this.getLikedBy();
  }

  getLikedBy() {
    this.memberService.getUserLikedBy(this.username).subscribe(
      (res) => {
        this.likedBy = res ? true : false;
      }
    );
  }

  sendMessage() {
    this.messageSerivce.sendMessage(
      this.username, this.messageContent).subscribe(
        message=>{
          this.messages.push(message);
          this.messageForm.reset();
        }
      );
  }
}
