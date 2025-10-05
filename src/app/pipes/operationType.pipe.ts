import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'operationType' })
export class OperationTypePipe implements PipeTransform {
  transform(value: number): string {
    return value === 0 ? 'Wpłata' : 'Wypłata';
  }
}
