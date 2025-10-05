interface Operation {

  operationDate: string;
  amount: number;
  operationType: OperationType;
}

export type {Operation};

export enum OperationType {
  Deposit,
  Withdrawl,
}
