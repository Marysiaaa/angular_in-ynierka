export interface Basket {
  id: string,
  basketProducts: BasketItem[]
}

export interface BasketItem {
  productId: string,
  name: string,
  quantity: number,
  price: number
  totalAmount: number
}
