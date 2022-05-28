import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/models/member';
import { Message } from 'src/app/models/message';
import { MembersService } from 'src/app/services/members.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('tabs') memberTabs!: TabsetComponent;
  member:Member| null = null;
  galleryOptions: NgxGalleryOptions[] | undefined;
  galleryImages: NgxGalleryImage[] | undefined;
  liked!: boolean;
  activeTab!: TabDirective;
  messages: Message[] = [];
  constructor(private memberService:MembersService,
      private route: ActivatedRoute, private messageService: MessageService){}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data['member'];
    })
    this.route.queryParams.subscribe(
      params => {
        params['tab'] ? this.selectTab(params['tab']) : this.selectTab(0);
        this.getLiked();
      }
    )
    this.galleryOptions = [
      {
        width:'500px',
        height:'500px',
        imagePercent:100,
        thumbnailsColumns: 4,
        imageAnimation:NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[] | undefined {
    if(this.member == null)
      return;

    const imageUrls = [];
    for(let photo of this.member?.photos) {
      imageUrls.push({
        small:photo?.url,
        medium:photo?.url,
        big:photo?.url
      });
    }
    return imageUrls;
  }

  getLiked() {
    debugger;
    if(this.member)
      this.memberService.getUserLiked(this.member.userName).subscribe(
        res => this.liked = res ? true : false
      );
  }
  
  toggleLike() {
    if(this.member)
      this.memberService.toggleLike(this.member.userName).subscribe(
        (res) =>{
          console.log(res);
          this.liked = !this.liked
        }
      );
  }

  loadMessages() {
    if(this.member && this.member.userName)
      this.messageService.getMessageThread(this.member.userName).subscribe(
        messages => {
          console.log(messages);
          this.messages = messages;

        }
      )
    }

  selectTab(tabId : number) {
    if(this.memberTabs)
      this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.loadMessages();
    }
  }
}
