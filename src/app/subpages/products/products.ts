import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {RoutePath} from "../../enums/route-path";
import {take} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ProductService} from '../../services/product.service';
import {Product} from '../../types/product';

@Component({
  selector: "cp-orders",
  imports: [
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./products.html",
  styleUrls: ["./products.css"]
})
export class Products implements AfterViewInit {
  @ViewChild(MatSort)
  protected readonly matSort!: MatSort;
  protected readonly displayedColumns: string[] = ["ProductId", "NameProduct", "PriceProduct", "QuantityProduct", "Category"];
  protected readonly dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  protected readonly RoutePath: typeof RoutePath = RoutePath;

  private readonly _productService: ProductService = inject(ProductService);
  private readonly _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);


  constructor() {
    this._productService
      .getAll()
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((data: Product[]): void => {
        console.log('Ladowanie danych')
        console.log(data);
        this.dataSource.data = data;
      });
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort;
  }

  protected async announceSortChange(): Promise<void> {
    await this._liveAnnouncer.announce("Zmieniono sortowanie produktów");
  }


}
