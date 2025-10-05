import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {User} from '../types/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl: string = environment.apiUrl;


  constructor(private http: HttpClient) {
  }

  register(data: any): Observable<any> {
    console.log("rejestracja")
    return this.http.post(`${this.apiUrl}/api/Account/register`, data);
  }

  GetMyAccount(): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(`${this.apiUrl}/api/account/me`, {headers});
  };
}
