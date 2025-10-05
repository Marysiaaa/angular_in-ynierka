import {AfterViewInit, Component, inject, OnInit, ViewChild} from "@angular/core";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {RoutePath} from "../../enums/route-path";
import {OrdersService} from "../../services/orders.service";
import {Order, StatusOrder} from "../../types/order";
import {take} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatIconModule} from "@angular/material/icon";
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {StatusOrderPipe} from '../../pipes/status-order.pipe';
import {MatButtonModule} from "@angular/material/button";
import {WalletService} from '../../services/wallet.service';
import {Wallet} from '../../types/wallet';

@Component({
  selector: "cp-my-orders",
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
  templateUrl: "./my_orders.component.html",
  styleUrls: ["./my_orders.component.scss"]
})
export class MyOrdersComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort, {static: false})
  matSort!: MatSort;
  protected readonly displayedColumns: string[] = ["OrderId", "UserId", "OrderDate", "TotalAmount", "StatusOrder", "PayOrder", "CancelOrder"];
  protected readonly dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();
  protected readonly RoutePath: typeof RoutePath = RoutePath;

  private readonly _ordersService: OrdersService = inject(OrdersService);
  private readonly _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);
  wallet!: Wallet;

  showPopup = false;

  message = "";

  ngOnInit(): void {
    this.walletService.GetWallet().pipe(take(1)).subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        console.log('Portfel załadowany:', wallet);
      },
      error: () => {
        this.showPopup = true;
        this.message = 'Nie udało się pobrać portfela użytkownika';
      }
    });
  }


  constructor(private walletService: WalletService) {
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

  public StatusOrder = StatusOrder;

  public payOrder(order: Order) {
    if (order.statusOrder == StatusOrder.Canceled) {
      this.showPopup = true;
      this.message = "Nie możesz opłacić zamówienia, gdyż zostało anulowane. ";
    } else if (order.statusOrder == StatusOrder.PAID) {
      this.showPopup = true;
      this.message = "Nie możesz opłacić ponownie zamówienia, gdyż zostało już opłacone ";
    } else if (order.statusOrder == StatusOrder.Delivered) {
      this.showPopup = true;
      this.message = "Nie możesz opłacić ponownie zamówienia, gdyż zamówienie zostało już dostarczone ";
    }
    else if (!this.wallet) {
      this.showPopup = true;
      this.message = 'Portfel nie został jeszcze załadowany.';
      return;
    }
    else if (this.wallet.balance < order.totalAmount) {
      this.showPopup = true;
      this.message = 'Brak wystarczających środków w portfelu.';
      return;

  }else
      this._ordersService.pay(order).pipe(take(1)).subscribe({
        next: () => {
          order.statusOrder = StatusOrder.PAID;
          this.showPopup = true;
          this.message = "Zamówienie zostało opłacone!";
        },
        error: () => {
          this.showPopup = true;
          this.message = "Wystąpił błąd podczas opłacania zamówienia.";
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
      this.message = "Nie możesz anulować zamówienia, gdyż zostało już dostarczone Tobie ";}
    else
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
