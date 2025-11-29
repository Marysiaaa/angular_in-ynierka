import { Product } from './product';

export interface BasketItem {
  product: Product;
  quantityProduct: number;
  totalAmount: number;
}
