import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BasketService } from '../../services/basket.service';
import { Product, ProductCategory } from '../../types/product';
import { take } from 'rxjs';
import {ProductService} from '../../services/product.service';

@Component({
  selector: "cp-home",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent {

  products: Product[] = [];
  selectedTab: 'dlaNiej' | 'dlaNiego' = 'dlaNiej';
  showPopup = false;
  showInaccessible=false;

  constructor(
    private productService: ProductService,
    private basketService: BasketService,
    private router: Router
  ) {
    this.productService.getAll()
    .pipe(take(1))
    .subscribe(data => {
      console.log("Pobrane produkty:", data);
      this.products = data;
    });}

  get filteredProducts(): Product[] {
    const selectedCategory =
      this.selectedTab === 'dlaNiej'
        ? ProductCategory.DlaNiej
        : ProductCategory.DlaNiego;

    return this.products.filter(p => p.category === selectedCategory);
  }

  buy(product: Product) {
    if (product.quantityProduct > 0) {
      this.basketService.addProduct(product);
      product.quantityProduct -= 1;
      this.showPopup = true;
    } else {
      this.showInaccessible = true;
    }
  }

  goToBasket() {
    this.showPopup = false;
    this.router.navigate(['/basket']);
  }

  closePopup() {
    this.showPopup = false;
    this.showInaccessible = false;
  }

  changeTab(tab: 'dlaNiej' | 'dlaNiego') {
    this.selectedTab = tab;
  }
}
