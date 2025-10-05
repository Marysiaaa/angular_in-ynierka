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
  private basketId: string | undefined;
  private basketItems = new BehaviorSubject<BasketProduct[]>([]);
  basketItems$ = this.basketItems.asObservable();

  constructor(private http: HttpClient) {
    console.log('loading basket service')
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http
      .get<Basket>(`${this.apiUrl}/api/users/myBasket`, {headers})
      .subscribe({
        next: basket => {
          console.log("basket", basket);
          this.basketId = basket.id;
          this.basketItems.next(basket.basketProducts);
          console.log("basketItems", this.basketItems.value);
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
      this.increaseQuantity(product.id);
    } else {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      const body = {productId: product.id};
      this.http.post(`${this.apiUrl}/api/baskets/${this.basketId}/basketProducts`, body, {headers})
        .subscribe(() => {
          console.log('Dodano produkt do koszyka: ', product.nameProduct, ' (id: ', product.id, '')
          items.push({
            productId: product.id,
            nameProduct: product.nameProduct,
            quantityProduct: 1,
            priceProduct: product.priceProduct,
            totalAmount: product.priceProduct
          });
          this.setItems([...items])

        });
    }
  }

  increaseQuantity(productId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.patch(`${this.apiUrl}/api/baskets/${this.basketId}/basketProducts/${productId}/increase`,
      null,
      {headers}
    ).subscribe(() => {
      this.updateLocalQuantity(productId, +1);
    });
  }

  decreaseQuantity(productId: string, currentQuantity: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if(currentQuantity<=1){
      return ;
    }

    return this.http.patch(
      `${this.apiUrl}/api/baskets/${this.basketId}/basketProducts/${productId}/decrease`,
      null,
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
      .reduce((sum, item) => sum + item.totalAmount, 0);
  }

  removeItem(productId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(
      `${this.apiUrl}/api/baskets/${this.basketId}/basketProducts/${productId}`, {headers}
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
      .get<{ id: string; basketProducts: BasketProduct[] }>(`${this.apiUrl}/api/baskets/${this.basketId}`, {headers})
      .subscribe({
        next: basket => {
          this.basketItems.next(basket.basketProducts);
        },
        error: err => console.error("Błąd pobierania koszyka", err)
      });
  }
  getBasketId(): string | undefined {
    return this.basketId;
  }
}
