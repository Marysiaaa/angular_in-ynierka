interface Order {
  OrderId: string;
  UserId: string;
  OrderDate:string;
  TotalAmount: number;
  StatusOrder: number;
}

export type {Order};
