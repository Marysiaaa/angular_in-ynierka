export interface Product {
  id: string;
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
