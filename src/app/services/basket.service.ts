import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {BasketItem} from '../types/basketItem';
import {Product, ProductCategory} from '../types/product';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environment';



@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private apiUrl: string = environment.apiUrl;


  private basketItems = new BehaviorSubject<BasketItem[]>([]);
  basketItems$ = this.basketItems.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const userId = localStorage.getItem("userId");

    this.http
      .get<string>(`${this.apiUrl}/users/${userId}/myBasket`, { headers })
      .subscribe({
        next: id => {
          this.basketId = id;
          this.loadBasket();
        },
        error: err => console.error("Błąd pobierania koszyka", err)
      });
  }

  getItems(): BasketItem[] {
    return this.basketItems.value;
  }

  setItems(items: BasketItem[]) {
    this.basketItems.next(items);
  }

  addItem(product: Product) {
    const items = this.getItems();
    const existing = items.find(i => i.product.id === product.id);

    if (existing) {
      existing.quantityProduct++;
      existing.totalAmount = existing.quantityProduct * existing.product.priceProduct;
    } else {
      items.push({
        product: product,
        quantityProduct: 1,
        totalAmount: product.priceProduct
      });
    }

    this.setItems([...items])
  }
  increaseQuantity(productId: string) {
    return this.http.patch(
      `${this.apiUrl}/baskets/${this.basketId}/basketProducts/${productId}/increase`,
      {}
    ).subscribe(() => {
      this.updateLocalQuantity(productId, +1);
    });
  }

  decreaseQuantity(productId: string) {
    return this.http.patch(
      `${this.apiUrl}/baskets/${this.basketId}/basketProducts/${productId}/decrease`,
      {}
    ).subscribe(() => {
      this.updateLocalQuantity(productId, -1);
    });
  }


  private updateLocalQuantity(productId: number, diff: number) {
    const updated = this.getItems().map(item => {
      if (item.product.id === productId) {
        const qty = Math.max(item.quantityProduct + diff, 1);
        return {
          ...item,
          quantityProduct: qty,
          totalAmount: qty * item.product.priceProduct
        };
      }
      return item;
    });

    this.setItems(updated);
  }
  loadBasket() {
    if (!this.basketId) return;

    this.http.get<BasketItem[]>(
      `${this.apiUrl}/baskets/${this.basketId}`
    ).subscribe({
      next: items => this.setItems(items),
      error: err => console.error("Błąd ładowania koszyka", err)
    });
  }

  }
