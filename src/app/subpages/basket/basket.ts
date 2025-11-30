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
  changeQty(item: BasketItem, diff: number) {
    if (diff === 1) {
      this.basketService.increaseQuantity(item.productId);
    } else {
      this.basketService.decreaseQuantity(item.productId);
    }

    this.updateTotal();
  }

  remove(item: BasketItem) {
    this.basketService.removeItem(item.productId);
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.basketService.getTotal();
  }



  updateSummary() {
    this.total = this.basketService.getTotal();
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
