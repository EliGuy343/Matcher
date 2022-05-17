import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() username!:string;
  messages !:Message[];

  constructor(private messageSerivce: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    if(this.username)
      this.messageSerivce.getMessageThread(this.username).subscribe(
        messages => {
          console.log(messages);
          this.messages = messages;

        }
      )
    }
}
