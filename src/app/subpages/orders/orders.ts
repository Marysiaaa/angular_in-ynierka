import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {RoutePath} from "../../enums/route-path";
import {Order, StatusOrder} from "../../types/order";
import {take} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatIconModule} from "@angular/material/icon";
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {StatusOrderPipe} from '../../pipes/status-order.pipe';
import {MatButtonModule} from "@angular/material/button";
import {OrdersService} from '../../services/orders.service';

@Component({
  selector: "cp-orders",
  imports: [
    MatTableModule,
    MatSortModule,
    MatIconModule,
    NgClass,
    StatusOrderPipe,
    DatePipe,
    MatButtonModule,
    NgIf
  ],
  templateUrl: "./orders.html",
  styleUrls: ["./orders.css"]
})
export class OrdersComponent implements AfterViewInit {
  @ViewChild(MatSort)
  protected readonly matSort!: MatSort;
  protected readonly displayedColumns: string[] = ["OrderId", "UserId", "OrderDate", "TotalAmount", "StatusOrder", "ShippOrder", "CancelOrder", "DeliverOrder"];
  protected readonly dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();
  protected readonly RoutePath: typeof RoutePath = RoutePath;

  private readonly _ordersService: OrdersService = inject(OrdersService);
  private readonly _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);
  showPopup = false;

  message = "";

  constructor() {
    this._ordersService
      .getAllOrders()
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

  public StatusOrder = StatusOrder;

  public shippOrder(order: Order) {
    if (order.statusOrder == StatusOrder.Canceled) {

      this.showPopup = true;
      this.message = "Nie możesz wysłac zamówienia, gdyż zostało anulowane. ";

    } else if (order.statusOrder == StatusOrder.Shipped) {
      this.showPopup = true;
      this.message = "Nie możesz wysłać ponownie zamówienia, gdyż zostało już wysłane ";
    } else if (order.statusOrder == StatusOrder.Delivered) {
      this.showPopup = true;
      this.message = "Nie możesz wysłać zamówienia, gdyż ono już zostało dostarczone ";
    } else if (order.statusOrder == StatusOrder.InProgress) {
      this.showPopup = true;
      this.message = "Nie możesz wysłać zamówienia, gdyż nie jest jeszcze opłacone ";
    } else if (order.statusOrder == StatusOrder.Canceled) {
      this.showPopup = true;
      this.message = "Nie możesz wysłać zamówienia, gdyż jest ono anulowane ";

    } else
      this._ordersService.shipOrder(order).pipe(take(1)).subscribe({
        next: () => {
          order.statusOrder = StatusOrder.Shipped;
          this.showPopup = true;
          this.message = "Zamówienie zostało wysłane!";

        },
        error: () => {
          this.showPopup = true;
          this.message = "Wystąpił błąd podczas opłacania zamówienia.";
        }
      });
  }

  public deliverOrder(order: Order) {

    if (order.statusOrder == StatusOrder.Canceled) {
      this.showPopup = true;
      this.message = "Nie możesz dostarczyć anulowanego zamówienia ";
    } else if (order.statusOrder == StatusOrder.InProgress) {
      this.showPopup = true;
      this.message = "Nie możesz dostarczyć zamówienia, gdyż Twoje zamówienie nie jest jeszcze opłacone ";

    } else
      this._ordersService.deliveredOrder(order).pipe(take(1)).subscribe({
        next: () => {
          order.statusOrder = StatusOrder.Delivered;
          this.showPopup = true;
          this.message = "Zamówienie zostało dostarczone.";
        },
        error: () => {
          this.showPopup = true;
          this.message = "Nie udało się dostarczyć  zamówienia.";
        }
      });
  }

  public cancelOrder(order: Order) {

    if (order.statusOrder == StatusOrder.PAID) {
      this.showPopup = true;
      this.message = "Nie możesz anulować zamówienia, gdyż zostało już opłacone ";
    } else if (order.statusOrder == StatusOrder.Shipped) {
      this.showPopup = true;
      this.message = "Nie możesz anulować zamówienia, gdyż zostało już wysłane do Ciebie ";
    } else if (order.statusOrder == StatusOrder.Delivered) {
      this.showPopup = true;
      this.message = "Nie możesz anulować zamówienia,które zostało już dostarczone";
    } else if (order.statusOrder == StatusOrder.Canceled) {
      this.showPopup = true;
      this.message = "Nie możesz anulować zamówienia,gdyż już było anulowane";

    } else
      this._ordersService.cancelOrder(order).pipe(take(1)).subscribe({
        next: () => {
          order.statusOrder = StatusOrder.Canceled;
          this.showPopup = true;
          this.message = "Zamówienie zostało anulowane.";
        },
        error: () => {
          this.showPopup = true;
          this.message = "Nie udało się anulować zamówienia.";
        }
      });
  }

  closePopup() {
    this.showPopup = false;


  }
}
