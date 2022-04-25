import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members!: Member[];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();
  constructor(private http: HttpClient) {}

  getMembers(page?: number, itemsPerPage?: number) {
    // Total fucking халтура but it will work for now
    // TODO: Figure out a better way to check when to update member state
    
    // if(this.members !== undefined && this.members!.length > 1)
    //   return of(this.members);

    let params = new HttpParams();
    if(page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    return this.http.get<Member[]>(this.baseUrl + 'users',{ observe:'response', params}).pipe(
      
      map(response=> {
          if(response.body){
            this.paginatedResult.result = response.body;
            if(response.headers.get('pagination') != null) {
              this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);

            }
          }
          return this.paginatedResult;
        })
    );
  }

  getMember(userName:String | null) {
    if(userName == null){
      return;
    }

    const member = this.members?.find(x => x.userName === userName);
    if(member !== undefined)
      return of(member);

    return this.http.get<Member>(this.baseUrl+ 'users/' +userName).pipe(
      map(member=>{
        if(this.members === undefined) {
          this.members = [member];
        }
          return member;
      })
    );
  }

  updateMember(member:Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members!.indexOf(member);
        this.members![index] = member;
      })
    );
  }

  setMainPhoto(PhotoId: Number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/'+PhotoId,{});
  }

  deletePhoto(PhotoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' +PhotoId); 
  }
}
