import { Pipe, PipeTransform } from '@angular/core';
import { StatusOrder } from '../types/order';

@Pipe({
  name: 'statusOrder',
  standalone: true
})
export class StatusOrderPipe implements PipeTransform {
  private readonly statusLabels: Record<StatusOrder, string> = {
    [StatusOrder.InProgress]: 'W trakcie',
    [StatusOrder.Shipped]: 'Wysłane',
    [StatusOrder.Delivered]: 'Dostarczone',
    [StatusOrder.Canceled]: 'Anulowane',
    [StatusOrder.PAID]: 'Opłacone'
  };

  transform(value: StatusOrder): string {
    return this.statusLabels[value] ?? 'Nieznany';
  }
}
