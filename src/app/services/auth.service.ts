import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../environment';
import {loginResponse} from '../types/loginResponse';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private router = inject(Router);

  constructor(private http: HttpClient) {
  }


  public isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

  login(email: string, password: string): Observable<loginResponse> {
    return this.http.post(`${this.apiUrl}/api/Account/login`, {email, password}).pipe(
      tap((response: any) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.isAuthenticated.set(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPayload.isAdmin === 'True'
  }

}


