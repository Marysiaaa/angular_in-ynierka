import { Product } from './product';

export interface BasketItem {
  Product: Product;
  QuantityProduct: number;
  TotalAmount: number;
}
