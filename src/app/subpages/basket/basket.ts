import {AfterViewInit, Component, OnInit, ViewChild, inject} from '@angular/core';
import {MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {BasketProduct} from '../../types/basketProduct';
import {CurrencyPipe, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';
import {BasketService} from '../../services/basket.service';
import {environment} from '../../../environment';


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
  @ViewChild(MatTable) table!: MatTable<BasketProduct>;

  displayedColumns: string[] = [
    "NameProduct",
    "PriceProduct",
    "QuantityProduct",
    "TotalAmount",
    "Actions"
  ];

  dataSource: MatTableDataSource<BasketProduct> = new MatTableDataSource<BasketProduct>();

  constructor(
    private basketService: BasketService,
    private router: Router,
  ) {
  }

  basketItems: BasketProduct[] = [];
  total: number = 0;

  ngOnInit() {
    this.basketService.basketItems$.subscribe((items: BasketProduct[]) => {
      this.dataSource.data = items;
      this.basketItems = items;
      this.updateSummary();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.matSort;
  }
  errorPopupQuantity = false;

  changeQty(item: BasketProduct, diff: number) {

    if (diff === -1 && item.quantityProduct <= 1) {
      this.errorPopupQuantity = true;
      return;
    }

    this.errorPopupQuantity = false;

    if (diff === 1) {
      this.basketService.increaseQuantity(item.productId);
    }

    if (diff === -1) {
      this.basketService.decreaseQuantity(
        item.productId,
        item.quantityProduct
      );
    }

    this.updateTotal();
  }


  remove(item: BasketProduct) {
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

  successPopup = false;
  errorPopup = false;


  zlozZamowienie() {
    const basketId = this.basketService.getBasketId();
    if (!basketId) {
      alert('Nie znaleziono koszyka!');
      return;
    }

    if (!this.basketItems || this.basketItems.length === 0) {
      this.errorPopup=true;
      return;
    }

    const token = localStorage.getItem('token');

    fetch(`${environment.apiUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({basketId})
    })
      .then(async response => {
        if (response.ok) {
          const result = await response.json();
          console.log('Zamówienie utworzone, Id:', result.id);
          this.successPopup = true;            // pokaz popup sukcesu
          this.basketService.setItems([]);  // wyczyść koszyk
          this.updateTotal();
        } else {
          const error = await response.text();
          console.error('Błąd tworzenia zamówienia:', error);
          alert('Nie udało się złożyć zamówienia');
        }
      })
      .catch(err => {
        console.error('Błąd sieci:', err);
        alert('Błąd sieci przy tworzeniu zamówienia');
      });
  }
  closePopupError() {
    this.errorPopupQuantity = false; // zamknij popup

  }

  closePopup() {
    this.successPopup = false; // zamknij popup
    this.router.navigate(['/home']); // przekierowanie

  }

}
