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
  private basketId: string | undefined;  // <- tutaj podaj swój koszyk
  private basketItems = new BehaviorSubject<BasketItem[]>([]);
  basketItems$ = this.basketItems.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http
      .get<string>(`${this.apiUrl}/api/users/myBasket`, { headers })
      .subscribe({
        next: id => {
          this.basketId = id;
          console.log("basketId", this.basketId);

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
    const existing = items.find(i => i.productId === product.id);

    if (existing) {
      existing.quantity++;
      existing.totalAmount = existing.quantity * existing.price;
    } else {
      items.push({
        productId: product.id,
        name: product.nameProduct,
        quantity: 1,
        price: product.priceProduct,
        totalAmount: product.priceProduct
      });
    }

    this.setItems([...items])
  }

  increaseQuantity(productId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch(
      `${this.apiUrl}/baskets/${this.basketId}/basketProducts/${productId}/increase`, {headers}
    ).subscribe(() => {
      this.updateLocalQuantity(productId, +1);
    });
  }

  decreaseQuantity(productId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch(
      `${this.apiUrl}/baskets/${this.basketId}/basketProducts/${productId}/decrease`,
      {headers}
    ).subscribe(() => {
      this.updateLocalQuantity(productId, -1);
    });
  }

  private updateLocalQuantity(productId: string, diff: number) {
    const updated = this.getItems().map(item => {
      if (item.productId === productId) {
        const qty = Math.max(item.quantity + diff, 1);
        return {
          ...item,
          quantityProduct: qty,
          totalAmount: qty * item.price
        };
      }
      return item;
    });

    this.setItems(updated);
  }

  getTotal() {
    return this.getItems()
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  removeItem(productId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(
      `${this.apiUrl}/baskets/${this.basketId}/basketProducts/${productId}`, {headers}
    ).subscribe(() => {
      const newItems = this.getItems().filter(i => i.productId !== productId);
      this.setItems(newItems);
    });
  }

  //Strumień koszyka
  getBasket() {
    return this.basketItems$;
  }

  private loadBasket() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http
      .get<BasketItem[]>(`${this.apiUrl}/api/baskets`, {headers})
      .subscribe({
        next: basketItems => {
          this.basketItems.next(basketItems);
        },
        error: err => console.error("Błąd pobierania koszyka", err)
      });
  }
}
