import { Component, OnInit, OnDestroy } from '@angular/core';

import { IProduct } from '../product';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pm-product-shell-list',
  templateUrl: './product-shell-list.component.html'
})
export class ProductShellListComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Products';
  errorMessage: string;
  products: IProduct[];
  selectedProduct: IProduct | null;
  sub1: Subscription;
  sub2: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.sub1 = this.productService.selectedProductChanges$.subscribe(
      sp => this.selectedProduct = sp
    );
    this.sub2 = this.productService.getProducts().subscribe(
      (products: IProduct[]) => {
        this.products = products;
      },
      (error: any) => this.errorMessage = <any>error
    );
  }

  onSelected(product: IProduct): void {
    this.productService.changeSelectedProduct(product);//The selected product will be pushed into the observable and broadcasted to all subscribers.
    //this.productService.currentProduct = product;
  }
  
  ngOnDestroy(): void{
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
}
