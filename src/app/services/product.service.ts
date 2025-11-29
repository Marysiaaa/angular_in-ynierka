import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Product} from "../types/product";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environment';

@Injectable({
  providedIn: "root"
})
export class ProductService {
  private apiUrl: string = environment.apiUrl;


  constructor(private http: HttpClient) {
  }


  getAll(): Observable<Product[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Product[]>(`${this.apiUrl}/api/Products`, {headers});
  };

}
