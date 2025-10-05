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

  getClientOrders(): Observable<Order[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log(headers);
    return this.http.get<Order[]>(`${this.apiUrl}/api/Orders/clientOrders`, {headers});
  };

  getAllOrders(): Observable<Order[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log(headers);
    return this.http.get<Order[]>(`${this.apiUrl}/api/Orders/allOrders`, {headers});
  };

  pay(order: Order): Observable<Order> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Order>(`${this.apiUrl}/api/orders/${order.orderId}/pay`, {}, {headers});
  }

  shipOrder(order: Order): Observable<Order> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Order>(`${this.apiUrl}/api/orders/${order.orderId}/ship`, {}, {headers});
  }

  deliveredOrder(order: Order): Observable<Order> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Order>(`${this.apiUrl}/api/orders/${order.orderId}/deliver`, {}, {headers});
  }

  cancelOrder(order: Order): Observable<Order> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Order>(`${this.apiUrl}/api/orders/${order.orderId}/cancel`, {}, {headers});
  }


}
