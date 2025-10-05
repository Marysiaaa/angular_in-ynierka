export interface Basket {
  id: string,
  basketProducts: BasketProduct[]
}

export interface BasketProduct {
  productId: string,
  nameProduct: string,
  quantityProduct: number,
  priceProduct: number
  totalAmount: number
}
