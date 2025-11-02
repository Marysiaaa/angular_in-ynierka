import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Order } from "../types/order";

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  // Przykładowe dane — możesz później zastąpić wywołaniem HTTP
  private readonly _orders: Order[] = [
    { id: 1, date: "2025-10-15",userId:2,totalAmount:50, status: "W realizacji" },
    { id: 2, date: "2025-10-18",userId:4, totalAmount:50, status: "Zakończone" }
  ];

  constructor() {}

  /**
   * Zwraca wszystkie zamówienia jako Observable
   */
  getAll(): Observable<Order[]> {
    return of(this._orders);
  }



}
