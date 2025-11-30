import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Operation } from "../types/operation";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environment';
import {User} from '../types/user';

@Injectable({
  providedIn: "root"
})
export class OperationService {

  private apiUrl: string = environment.apiUrl;


  constructor(private http: HttpClient) {
  }


  GetOperations(): Observable<Operation[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Operation[]>(`${this.apiUrl}/api/Operations/operations`, {headers});
  };



}
