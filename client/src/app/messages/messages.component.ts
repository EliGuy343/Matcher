import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Pagination } from '../models/pagination';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages!: Message[];
  pagination!: Pagination;
  container = 'inbox';
  pageNumber:number = 1;
  pageSize:number = 5;
  constructor(private messageService:MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }
  
  loadMessages() {
    this.messageService.getMessage(this.pageNumber, this.pageSize, this.container).subscribe(
      res =>{
        this.messages = res.result;
        this.pagination = res.pagination;
      }
    )
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }
}
