import {AfterViewInit, Component, OnInit, ViewChild, inject} from '@angular/core';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {BasketItem} from '../../types/basketItem';
import {CurrencyPipe, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import {BasketService} from '../../services/basket.service';


@Component({
  standalone: true,
  selector: 'app-basket',
  templateUrl: './basket.html',
  styleUrls: ['./basket.css'],
  imports: [
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    CurrencyPipe,
    MatIconModule,
    NgIf

  ]
})
export class BasketComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<BasketItem>;

  displayedColumns: string[] = [
    "NameProduct",
    "PriceProduct",
    "QuantityProduct",
    "TotalAmount",
    "Actions"
  ];

  dataSource: MatTableDataSource<BasketItem> = new MatTableDataSource<BasketItem>();

  constructor(
    private basketService: BasketService,
    private router: Router,
  ) {}

  basketItems: BasketItem[] = [];
  total: number = 0;

  ngOnInit() {
    this.basketService.basketItems$.subscribe((items: BasketItem[]) => {
      this.dataSource.data = items;
      this.basketItems = items;
      this.updateSummary();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.matSort;
  }

  changeQty(row: BasketItem, diff: number) {
    const newQty = row.quantityProduct + diff;
    row.quantityProduct = newQty < 1 ? 1 : newQty;
    row.totalAmount = row.quantityProduct * row.product.priceProduct;

    this.updateSummary();
    this.table.renderRows();
  }

  updateSummary() {
    this.total = this.basketService.getTotal();
  }
  remove(row: BasketItem) {
    this.basketService.removeItem(row.product.id);
  }

  kontynuujZakupy() {
    this.router.navigate(['/home']); // przekierowanie do strony home
  }

  showPopup = false;

  zlozZamowienie() {
    this.showPopup = true; // pokaz popup
  }

  closePopup() {
    this.showPopup = false; // zamknij popup
    this.router.navigate(['/home']); // przekierowanie

}}
