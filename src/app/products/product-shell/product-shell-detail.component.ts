import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product.service';
import { IProduct } from '../product';
import { Subscription } from 'rxjs';

@Component({
    selector: 'pm-product-shell-detail',
    templateUrl: './product-shell-detail.component.html'
})
export class ProductShellDetailComponent implements OnInit, OnDestroy {

    pageTitle: string = 'Product Detail';

    //We are pulling new values here from the service.
    //return this.productService.currentProduct;
    //Instead of pulling lets subcribe to the Subject so that we can get new notifications when the selected product changes.
    //We need a property and we will remove the getter as it is not needed. Instead we will subscribe to notifications in ngOnInit method
    /*     
    get product(): IProduct | null {
        return this.productService.changeSelectedProduct()
    } 
    */
   product: IProduct | null;
    sub: Subscription;

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.sub = this.productService.selectedProductChanges$.subscribe(
            selectedProduct => this.product = selectedProduct
        );
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

}
