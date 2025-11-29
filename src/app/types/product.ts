export interface Product {
  id: number;
  nameProduct: string;
  priceProduct: number;
  quantityProduct: number;
  category: ProductCategory;
}

export enum ProductCategory
{
  DlaNiej,
  DlaNiego
}
