import { Component,
         OnInit,
         ViewChild,
         AfterViewInit} from '@angular/core';

import { IProduct } from './product';
import { ProductService } from './product.service';
import { CriteriaComponent } from '../shared/criteria/criteria.component';
import { ProductParameterService } from './product-parameter.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  pageTitle: string= 'List of Products';
  imageWidth: number = 50;
  imageMargin = 2;
  includeDetail: boolean = true;
  errorMessage : string;
  parentListFilter: string;
  filteredProducts: IProduct[];
  products: IProduct[];
  //Instead of using a simple getter we need a reference to the child component and then we can 
  //use that reference to assign filterBy
  //We can get a reference to the child componet using the @ViewChild decorator.
  //We need to pass it the name of the child componenr, in this case, CriteriaComponent
  @ViewChild(CriteriaComponent) filterComponent: CriteriaComponent;
  //getter and setters without a backing variable as we are using a service ProductParameterService
  get showImage():  boolean {
    return this.productParameterService.showImage;
  }
  set showImage(value:boolean){
    this.productParameterService.showImage = value;
  }
  constructor(private productService: ProductService,
              private productParameterService: ProductParameterService) {
    
  }

  performFilter(filterBy?: string): void {
     if(filterBy){
       this.filteredProducts = this.products.filter((product: IProduct) => 
      product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1);
     } else{
       this.filteredProducts = this.products;
     }
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (products: IProduct[]) => {
        this.products = products;
        this.filterComponent.listFilter = this.productParameterService.filterBy;
      },
      (error: any) => this.errorMessage = <any>error
    );
  }

  onValueChange(value: string): void{
    this.productParameterService.filterBy = value;
    this.performFilter(value);
  }
  ngAfterViewInit(): void {
    this.parentListFilter = this.filterComponent.listFilter;
  }
}
