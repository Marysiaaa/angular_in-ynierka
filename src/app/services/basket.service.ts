import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Basket, BasketProduct} from '../types/basketProduct';
import {Product, ProductCategory} from '../types/product';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private apiUrl: string = environment.apiUrl;
  private basketId: string | undefined;  // <- tutaj podaj swój koszyk
  private basketItems = new BehaviorSubject<BasketProduct[]>([]);
  basketItems$ = this.basketItems.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http
      .get<Basket>(`${this.apiUrl}/api/users/myBasket`, { headers })
      .subscribe({
        next: basket => {
          this.basketId = basket.id;
          console.log("basketId", this.basketId);
          this.basketItems.next(basket.basketProducts);

        },
        error: err => console.error("Błąd pobierania koszyka", err)
      });
  }

  getItems(): BasketProduct[] {
    return this.basketItems.value;
  }

  setItems(items: BasketProduct[]) {
    this.basketItems.next(items);
  }

  addProduct(product: Product) {
    const items = this.getItems();
    const existing = items.find(i => i.productId === product.id);

    if (existing) {
      existing.quantityProduct++;
      existing.totalAmount = existing.quantityProduct * existing.priceProduct;
    } else {
      items.push({
        productId: product.id,
        nameProduct: product.nameProduct,
        quantityProduct: 1,
        priceProduct: product.priceProduct,
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
    this.http.patch(`${this.apiUrl}/baskets/${this.basketId}/basketProducts/${productId}/increase`,
      {},
      { headers }
    )

.subscribe(() => {
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
        const qty = Math.max(item.quantityProduct + diff, 1);
        return {
          ...item,
          quantityProduct: qty,
          totalAmount: qty * item.priceProduct
        };
      }
      return item;
    });

    this.setItems(updated);
  }

  getTotal() {
    return this.getItems()
      .reduce((sum, item) => sum + (item.priceProduct * item.quantityProduct), 0);
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
      .get<{ id: string; basketProducts: BasketProduct[] }>(`${this.apiUrl}/api/baskets/${this.basketId}`, { headers })
      .subscribe({
        next: basket => {
          this.basketItems.next(basket.basketProducts);
        },
        error: err => console.error("Błąd pobierania koszyka", err)
      });
  }
}
