import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environment';
import {Operation} from '../types/operation';
import {Wallet} from '../types/wallet';

@Injectable({
  providedIn: "root"
})
export class WalletService {

  private apiUrl: string = environment.apiUrl;


  constructor(private http: HttpClient) {
  }

  GetWallet(): Observable<Wallet>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Wallet>(`${this.apiUrl}/api/wallets`, {headers});
  }

  GetOperations(): Observable<Operation[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Operation[]>(`${this.apiUrl}/api/Operations/operations`, {headers});
  };

  DepositFunds(amount: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<void>(
      `${this.apiUrl}/api/wallets/depositFunds`,
      { amount },
      { headers }
    );
  }

}
