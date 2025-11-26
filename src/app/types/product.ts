export interface Product {
  id: number;
  NameProduct: string;
  PriceProduct: number;
  QuantityProduct: number;
  category: ProductCategory;
}

export enum ProductCategory
{
  DlaNiej,
  DlaNiego
}
