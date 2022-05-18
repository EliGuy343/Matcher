import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { UserParams } from '../models/userParams';
import { getPaginatedResult, getPaginationHeaders } from './PaginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members!: Member[];
  memberCache = new Map();
  constructor(private http: HttpClient) {}

  getMembers(userParams: UserParams) {
    let key = JSON.stringify(userParams)
    let response =this.memberCache.get(key);
    debugger;
    if (response) {
      console.log(response);
      return of(response);
    }
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    let gendersToPick = '';
    for(let key of Object.keys(userParams.gender)) {
      gendersToPick = gendersToPick +`;${userParams.gender[key]}`;
    }
    params = params.append('gender', gendersToPick);
    params = params.append('orderBy', userParams.orderBy);
    return getPaginatedResult<Member[]>(this.baseUrl +'users',params, this.http)
    .pipe(map(response =>{
        this.memberCache.set(key, response);
        return response;
      })
    );
  }
  getPaginationHeaders(pageNumber: number, pageSize: number) {
    throw new Error('Method not implemented.');
  }

 

  getMember(userName:String | null) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member)=> member.userName === userName);

    if(member) 
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

  toggleLike(userName: string) {
    return this.http.post(this.baseUrl + 'likes/' + userName, {});
  }

  getLikes(predicate: string, pageNumber:number, pageSize:number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    return getPaginatedResult<Partial<Member[]>>(
      this.baseUrl + 'likes?predicate='+predicate , params, this.http);
  }

  getUserLiked(userName: string) {
    return this.http.get(this.baseUrl + 'likes/' + userName);
  }
}
