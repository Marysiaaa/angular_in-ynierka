import {inject, Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Order} from "../types/order";
import {environment} from '../../environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  private apiUrl: string = environment.apiUrl;


  constructor(private http: HttpClient) {
  }


  getAll(): Observable<Order[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log(headers);
    return this.http.get<Order[]>(`${this.apiUrl}/api/orders`, {headers});
  };
}
