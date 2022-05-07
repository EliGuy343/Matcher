import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/userParams';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members!: Member[];
  constructor(private http: HttpClient) {}

  getMembers(userParams: UserParams) {
    // Total fucking халтура but it will work for now
    // TODO: Figure out a better way to check when to update member state
    
    // if(this.members !== undefined && this.members!.length > 1)
    //   return of(this.members);
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    let gendersToPick = '';
    for(let key of Object.keys(userParams.gender)) {
      gendersToPick = gendersToPick +`;${userParams.gender[key]}`;
    }
    params = params.append('gender', gendersToPick);
    params = params.append('orderBy', userParams.orderBy);
    return this.getPaginatedResult<Member[]>(this.baseUrl +'users',params);
  }

  private getPaginatedResult<T>(url:string,params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
          if (response.headers.get('pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
          }
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
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
