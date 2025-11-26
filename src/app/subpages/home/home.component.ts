import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BasketService } from '../../services/basket.service';
import { Product, ProductCategory } from '../../types/product';


@Component({
  selector: "cp-home",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]})
export class HomeComponent {

  constructor(
    private basketService: BasketService,
    private router: Router
  ) {}

  selectedTab: 'dlaNiej' | 'dlaNiego' = 'dlaNiej';

  products: Product[] = [
    {
      id: 1,
      NameProduct: "Belle Rose Eau de Parfum",
      PriceProduct: 199,
      QuantityProduct: 3,
      category: ProductCategory.DlaNiego
    },
    {
      id: 2,
      NameProduct: "Mystic Oud Homme",
      PriceProduct: 249,
      QuantityProduct: 1,
      category: ProductCategory.DlaNiej
    },
    {
      id: 3,
      NameProduct: "Sweet Amore",
      PriceProduct: 159,
      QuantityProduct: 1,
      category: ProductCategory.DlaNiej
    }
  ];

  get filteredProducts(): Product[] {
    const selectedCategory =
      this.selectedTab === 'dlaNiej'
        ? ProductCategory.DlaNiej
        : ProductCategory.DlaNiego;

    return this.products.filter(p => p.category === selectedCategory);
  }

  showPopup = false;

  buy(product: Product) {
    if (product.QuantityProduct > 0) {
      // Dodanie do koszyka
      this.basketService.addItem({
        ...product,
        QuantityProduct: 1
      });

      // Zmniejszenie ilość dostępnego produktu
      product.QuantityProduct -= 1;

      // Pokazujemy popup
      this.showPopup = true;
    } else {
      alert("Produkt jest niedostępny!");

    }
  }
  goToBasket() {
    this.showPopup = false;
    this.router.navigate(['/basket']);
  }

  closePopup() {
    this.showPopup = false;
  }
  changeTab(tab: 'dlaNiej' | 'dlaNiego') {
    this.selectedTab = tab;
  }
}
