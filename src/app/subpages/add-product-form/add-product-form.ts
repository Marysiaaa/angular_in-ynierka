import {Component, OnInit} from '@angular/core';
import {Product, ProductCategory} from '../../types/product';
import {ProductService} from '../../services/product.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-product-form',
  imports: [
    FormsModule
  ],
  templateUrl: './add-product-form.html',
  styleUrl: './add-product-form.css'
})
export class AddProductForm implements OnInit {

  products: Product[] = [];

  newProduct: Partial<Product> = {
    nameProduct: '',
    priceProduct: 1,
    quantityProduct: 1,
    category: ProductCategory.DlaNiej
  };

  constructor(private productService: ProductService, private router: Router) {
  }

  ngOnInit() {
    this.loadProducts();
  }

  addProduct() {
    this.productService.addProduct(this.newProduct).subscribe(() => {
      alert("Produkt dodany!");
      this.newProduct = {nameProduct: '', priceProduct: 0, quantityProduct: 0, category: ProductCategory.DlaNiej};
      this.router.navigate(['/products']);

      this.loadProducts();
    });
  }

  private loadProducts() {
    this.productService.getAll().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  protected readonly ProductCategory = ProductCategory;
}
