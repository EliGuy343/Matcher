import { Photo } from "./Photo";

export interface Member {
    id: number;
    userName: string;
    age: number;
    photoUrl: string;
    displayName: string;
    created: Date;
    lastActive: Date;
    gender: string;
    introduction: string;
    lookingFor: string;
    intrests?: any;
    city: string;
    country: string;
    photos: Photo[];
}
