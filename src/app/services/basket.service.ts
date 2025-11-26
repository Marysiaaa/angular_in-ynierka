import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {BasketItem} from '../types/basketItem';
import {Product, ProductCategory} from '../types/product';


@Injectable({
  providedIn: 'root'
})
export class BasketService {

  private basketItems = new BehaviorSubject<BasketItem[]>([]);
  basketItems$ = this.basketItems.asObservable();

  private readonly _product: BasketItem[] = [
    {
      Product: {id: 5, NameProduct: 'Produkt A', PriceProduct: 10, QuantityProduct: 5, category: ProductCategory.DlaNiego},
      QuantityProduct: 2,
      TotalAmount: 20,
    },
    {
      Product: {id: 6, NameProduct: 'Produkt B', PriceProduct: 10, QuantityProduct: 5, category: ProductCategory.DlaNiego},
      QuantityProduct: 2,
      TotalAmount: 20,
    },
  ];

  constructor() {
    // Inicjalizacja koszyka
    this.basketItems.next([...this._product]);
  }

  getItems(): BasketItem[] {
    return this.basketItems.value;
  }

  addItem(product: Product) {
    const items = this.getItems();
    const existing = items.find(p => p.Product.id === product.id);

    if (existing) {
      existing.QuantityProduct += product.QuantityProduct;
    } else {
      const basketItem : BasketItem = {
        Product: product,
        TotalAmount: 1,
        QuantityProduct: 1,
      }
      items.push(basketItem);
    }
    this.basketItems.next([...items]);
  }

  updateQuantity(id: number, change: number) {
    const items = this.getItems().map(item => {
      if (item.Product.id === id) {
        const newQty = item.QuantityProduct + change;
        return {...item, QuantityProduct: Math.max(newQty, 1)};
      }
      return item;
    });
    this.basketItems.next(items);
  }

  getTotal() {
    return this.getItems()
      .reduce((sum, item) => sum + (item.Product.PriceProduct * item.QuantityProduct), 0);
  }
  removeItem(id: number) {
    const items = this.getItems().filter(item => item.Product.id !== id);
    this.basketItems.next(items)}


  //Strumień koszyka
  getBasket() {
    return this.basketItems$;
  }


}
