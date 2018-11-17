import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ProductData } from './product-data';

import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductEditComponent } from './product-edit.component';
import { ProductDetailGuard } from './product-detail.guard';
import { ProductEditGuard } from './product-edit.guard';
import { ProductService } from './product.service';
import { ProductParameterService } from './product-parameter.service';
import { ProductShellComponent } from './product-shell/product-shell.component';
import { ProductShellListComponent } from './product-shell/product-shell-list.component';
import { ProductShellDetailComponent } from './product-shell/product-shell-detail.component';


@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    InMemoryWebApiModule.forRoot(ProductData),
    RouterModule.forChild([
      { path: 'products', component: ProductShellComponent },
      {
        path: 'products/:id',
        canActivate: [ ProductDetailGuard],
        component: ProductDetailComponent
      },
      {
        path: 'products/:id/edit',
        canDeactivate: [ ProductEditGuard ],
        component: ProductEditComponent
      },
    ])
  ],
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductEditComponent,
    ProductShellComponent,
    ProductShellListComponent,
    ProductShellDetailComponent
  ],
  providers: [
    ProductService,
    ProductEditGuard,
    ProductParameterService
  ]
})
export class ProductModule { }
