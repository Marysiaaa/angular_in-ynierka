export interface Order {
  orderId: string;
  userId: string;
  orderDate: string;
  totalAmount: number;
  statusOrder: number;
}

export enum StatusOrder {
  InProgress,
  Shipped,
  Delivered,
  Canceled,
  PAID
}
