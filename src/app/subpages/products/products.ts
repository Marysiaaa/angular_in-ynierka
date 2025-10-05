import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {RoutePath} from "../../enums/route-path";
import {take} from "rxjs";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ProductService} from '../../services/product.service';
import {Product, ProductCategory} from '../../types/product';
import {Router} from '@angular/router';

@Component({
  selector: "cp-products",
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

  private readonly _productService: ProductService = inject(ProductService);
  private readonly _liveAnnouncer: LiveAnnouncer = inject(LiveAnnouncer);


  constructor( private router: Router
  ) {
    this.loadProducts();

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort;
  }

  protected async announceSortChange(): Promise<void> {
    await this._liveAnnouncer.announce("Zmieniono sortowanie produktów");
  }
  private loadProducts() {
    this._productService
      .getAll()
      .subscribe((data: Product[]): void => {
        console.log('Ladowanie danych')
        console.log(data);
        this.dataSource.data = data;
      });
  }
  deleteProduct(id: string) {
    if(!confirm("Czy na pewno chcesz usunąć ten produkt?")) return;

    this._productService.deleteProduct(id)
      .pipe(take(1))
      .subscribe(() => {
        alert("Produkt usunięty!");
        this.loadProducts();
      }, () => alert("Błąd przy usuwaniu produktu"));
  }


  openAddProduct() {
    this.router.navigate(['/add-product']);
  }

  protected readonly ProductCategory = ProductCategory;
}
