import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string =environment.apiUrl;
  private http: any;

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {username, password}).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
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
}}


