import { AfterViewInit, Component, inject, ViewChild } from "@angular/core";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { RoutePath } from "../../enums/route-path";
import { OrdersService } from "../../services/orders.service";
import {Order} from "../../types/order";
import { take } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "cp-cliests-orders",
  imports: [MatTableModule, MatSortModule, MatIconModule],
  templateUrl: "./clients_orders.component.html",
  styleUrl: "./clients_orders.component.scss"
})
export class ClientsOrdersComponent implements AfterViewInit {
  @ViewChild(MatSort)
  protected readonly matSort!: MatSort;
  protected readonly displayedColumns: string[] = ["OrderId", "UserId", "OrderDate","TotalAmount","StatusOrder"];
  protected readonly dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();
  protected readonly RoutePath: typeof RoutePath = RoutePath;

  private readonly _ordersService: OrdersService = inject(OrdersService);
  private readonly _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);

  constructor() {
    this._ordersService
      .getAll()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((data: Order[]): void => {
        this.dataSource.data = data;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort;
  }

  protected async announceSortChange(): Promise<void> {
    await this._liveAnnouncer.announce("Zmieniono sortowanie zamówień");
  }
}
