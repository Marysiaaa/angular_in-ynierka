import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../environment';
import {loginResponse} from '../types/loginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}


  login(email: string, password: string): Observable<loginResponse> {
    return this.http.post(`${this.apiUrl}/api/Account/login`, {email, password}).pipe(
      tap((response: any) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}


