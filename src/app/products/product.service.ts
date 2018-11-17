import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { IProduct } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';
  private products: IProduct[];
  //currentProduct: IProduct | null;
  
  private selectedProductSource = new BehaviorSubject<IProduct | null>(null);
  //By convention the dollar sign represents that the selectedProductChanges$ is an observable and not a simple property.
  selectedProductChanges$ = this.selectedProductSource.asObservable();
  //This exposes the read-only observable from our Subject. Now any component or service can subscribe to it to get notifications.
  //Also, any component can 
  
  constructor(private http: HttpClient) { }

  //Wrapping the Observer so that any component or service can subscribe to the observable. 
  //If there is no currently selected product then null will be passed. | is the union sign in typescript.
  changeSelectedProduct(selectedProduct: IProduct | null): void{
    //Pushing the selectedProduct in the obsrvable sequence of the Subject. 
    //The observable will then broadcast the notification passing along the selected product.
    this.selectedProductSource.next(selectedProduct); 
    //Any component can now push a new value to the subject which is then boradcast to all subscribers.
  }

  getProducts(): Observable<IProduct[]> {
    if(this.products){
      return of(this.products);
    }
    return this.http.get<IProduct[]>(this.productsUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        tap(data => this.products = data),
        catchError(this.handleError)
      );
  }

  getProduct(id: number): Observable<IProduct> {
    if (id === 0) {
      return of(this.initializeProduct());
    }
    //Retrieving the product from the cache instead from the backend server.
    if(this.products){
      //the find method finds the first element that matches the defined criteria. Here the criteria is the id of the item.
      const foundItem = this.products.find(item => item.id == id);
      if(foundItem){
        //Using of to create an observable from our item.
        return of(foundItem);
      }
    }
    //if the item  is not found in the cache get it from the backend server
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<IProduct>(url)
      .pipe(
        tap(data => console.log('getProduct: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createProduct(product: IProduct): Observable<IProduct> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    product.id = null;//The backend server will automatically assign a new id to this product. 
    return this.http.post<IProduct>(this.productsUrl, product, { headers: headers })
      .pipe(
        tap(data => console.log('createProduct: ' + JSON.stringify(data))),
        tap(data => {
          this.products.push(data);
          this.changeSelectedProduct(data);//This newly created product is now pushed into the observable sequence and broadcast to all subscribers. 
          //this.currentProduct = data;
        }),
        catchError(this.handleError)
      );
  }

  deleteProduct(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsUrl}/${id}`;
    return this.http.delete<IProduct>(url, { headers: headers })
      .pipe(
        tap(data => console.log('deleteProduct: ' + id)),
        tap(data => {
          const fountIndex = this.products.findIndex(item => item.id == id);
          if(fountIndex > -1){
            this.products.splice(fountIndex, 1);
            this.changeSelectedProduct(null); //This way the display detail page will not show a deleted product
            //this.currentProduct = null;//This way the display detail page will not show a deleted product
          }
        }),
        catchError(this.handleError)
      );
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsUrl}/${product.id}`;
    return this.http.put<IProduct>(url, product, { headers: headers })
      .pipe(
        tap(() => console.log('updateProduct: ' + product.id)),
        // Return the product on an update
        map(() => product),
        catchError(this.handleError)
      );
  }

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeProduct(): IProduct {
    // Return an initialized object
    return {
      id: 0, 
      productName: null,
      productCode: null,
      tags: [''],
      releaseDate: null,
      price: null,
      description: null,
      starRating: null,
      imageUrl: null
    };
  }
}
