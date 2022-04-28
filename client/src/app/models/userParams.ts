import { User } from "./user";

export class UserParams {
    gender?: any = {}; 
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 5; 
    
    constructor(user: User) {
        if(user.gender == 'male') {
            this.gender = {'female':'female'};
        }
        else if(user.gender == 'female') {
            this.gender = {'male':'male'};
        }
        else {
            this.gender = {};
        }
    }
}