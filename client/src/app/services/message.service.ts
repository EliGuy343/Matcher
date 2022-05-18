import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';
import { getPaginationHeaders,getPaginatedResult } from './PaginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getMessage(pageNumber:number, pageSize: number, container:string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('container', container);
    return getPaginatedResult<Message[]>(
      this.baseUrl + 'message', params, this.http);
  }
  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'message/thread/'+username);
  }
  sendMessage(username: string, content: string) {
    return this.http.post<Message>(
      this.baseUrl + 'message',{recipientUsername:username, content});
  }
}
