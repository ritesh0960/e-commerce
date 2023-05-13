import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  
  private baseUrl = 'http://localhost:1000/api/products';

  private categoryUrl = 'http://localhost:1000/api/productCategories';

  constructor(private httpClient:HttpClient) { }

  getProductListPaginate(thePage:number,
                         thepageSize:number,
                         thecategoryId:number) : Observable<GetResponseProducts>{
   
    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${thecategoryId}`
                       +`&page=${thePage}&size=${thepageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(thecategoryId:number) : Observable<Product[]>{
   
    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${thecategoryId}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response=>response._embedded.products)
    );
  }

  searchProducts(theKeyword : String) :Observable<Product[]> {
    const searchUrl=`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response=>response._embedded.products));
  }


  searchProductPaginate(thePage:number,
                          thepageSize:number,
                          theKeyword:String) : Observable<GetResponseProducts>{

const searchUrl=`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
  +`&page=${thePage}&size=${thepageSize}`;

return this.httpClient.get<GetResponseProducts>(searchUrl);
}


  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response=>response._embedded.productCategory)
    );
  }

  getProduct(theProductId: number) :Observable<Product>{
    const productUrl=`${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

}

interface GetResponseProducts{
  _embedded:{
    products: Product[];
  },
  page :{
    size :number,
    totalElements:number,
    totalPages:number,
    number:number
  };
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory: ProductCategory[];
  }
}
