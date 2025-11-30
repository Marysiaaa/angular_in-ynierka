import { AfterViewInit, Component, inject, ViewChild } from "@angular/core";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { RoutePath } from "../../enums/route-path";
import { OrdersService } from "../../services/orders.service";
import {Order, StatusOrder} from "../../types/order";
import { take } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {StatusOrderPipe} from '../../pipes/status-order.pipe';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: "cp-my-orders",
  imports: [MatTableModule, MatSortModule, MatIconModule, NgClass, StatusOrderPipe, DatePipe, MatIconButton, NgIf],
  templateUrl: "./my_orders.component.html",
  styleUrls: ["./my_orders.component.scss"]
})
export class OrdersComponent implements AfterViewInit {
  @ViewChild(MatSort)
  protected readonly matSort!: MatSort;
  protected readonly displayedColumns: string[] = ["OrderId", "UserId", "OrderDate","TotalAmount","StatusOrder","PayOrder","CancelOrder"];
  protected readonly dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();
  protected readonly RoutePath: typeof RoutePath = RoutePath;

  private readonly _ordersService: OrdersService = inject(OrdersService);
  private readonly _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);
  showSuccess = false;
  showError = false;
  showCancel = false;
  message = "";




  constructor() {
    console.log('konstruktor')
    this._ordersService
      .getAll()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((data: Order[]): void => {
        console.log('Ladowanie danych')
        console.log(data);
        this.dataSource.data = data;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort;
  }

  protected async announceSortChange(): Promise<void> {
    await this._liveAnnouncer.announce("Zmieniono sortowanie zamówień");
  }

  public  StatusOrder = StatusOrder;

  public payOrder(order: Order) {
    this._ordersService.payOrder(order).pipe(take(1)).subscribe({
      next: () => {
        order.statusOrder = StatusOrder.PAID;
        this.showSuccess = true;
        this.message = "Zamówienie zostało opłacone!";

      },
      error: () => {
        this.showError = true;
        this.message = "Wystąpił błąd podczas opłacania zamówienia.";
      }    });
  }

  public cancelOrder(order: Order) {
    this._ordersService.cancelOrder(order).pipe(take(1)).subscribe({
      next: () => {
        order.statusOrder = StatusOrder.Canceled;
        this.showCancel = true;
        this.message = "Zamówienie zostało anulowane.";
      },
      error: () => {
        this.showError = true;
        this.message = "Nie udało się anulować zamówienia.";
      }    });
  }

  closePopup() {
    this.showSuccess = false;
    this.showError = false;
    this.showCancel = false;
  }
}
