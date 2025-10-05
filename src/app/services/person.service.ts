import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {User} from "../types/user";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environment';
import {SponsorDetails} from '../types/sponsorDetails';

@Injectable({
  providedIn: "root"
})
export class PersonService {
  private apiUrl: string = environment.apiUrl;


  constructor(private http: HttpClient) {
  }
  getSponsorByRef(ref: string): Observable<SponsorDetails> {
    return this.http.get<SponsorDetails>(`${this.apiUrl}/api/Users/GetSponsorByRef?ref=${ref}`);
  }


  GetUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>(`${this.apiUrl}/api/Users/users`, {headers});
  };

  GetAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>(`${this.apiUrl}/api/Users/AllUsers`, {headers});
  };

}
