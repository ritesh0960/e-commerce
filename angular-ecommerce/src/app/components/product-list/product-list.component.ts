import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    products:Product[]=[];
    currentCategoryId: number=1;
    previousCategoryId:number=1;
    searchMode:boolean=false;

    //new properties for pagination
    thePageNumber:number=1;
    thePageSize:number=5;
    theTotalElements:number=0;

    previousKeyword:String=null;
     

  constructor(private productService: ProductService , 
              private cartService:CartService,
               private route: ActivatedRoute ){};
  
  ngOnInit(): void {

   this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
    
  }

  listProducts(){
      this.searchMode = this.route.snapshot.paramMap.has('keyword');
      if(this.searchMode){
         this.handleSearchProducts();
      }
      else{
        this.handleListProducts();
      }
      
     }

     handleSearchProducts(){
      const  theKeyword = this.route.snapshot.paramMap.get('keyword');
      
      //if we have a different keyword than previous 
      //then set pagenumber=1

      if(this.previousKeyword!=theKeyword){
        this.thePageNumber=1;
      }
      
      this.previousKeyword=theKeyword;
      console.log(`keyword=${theKeyword}  pageNumber=${this.thePageNumber}`);

      //now search for product using keyword
      // this.productService.searchProducts(theKeyword).subscribe(
      //   data=>{
      //     this.products=data;
      //   }
      // )

      this.productService.searchProductPaginate(this.thePageNumber-1,
                                                   this.thePageSize,
                                                   theKeyword).subscribe(this.processResult());
    
      }
    handleListProducts(){
             //check if the id parameter is available
     const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

     if(hasCategoryId)
     {
       //get the id param as string and convert it to number using + symbol
       this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
     }
     else
     {
       //set the default id value=1
       this.currentCategoryId=1;
     }

     //check if we have different category than previous
     //Note: Angular will reuse the component currently being viewed



     //if we have a different category id than previous
     //then setup page number back to 1
     if(this.previousCategoryId!=this.currentCategoryId){
      this.thePageNumber=1;

     }

     this.previousCategoryId=this.currentCategoryId;
     console.log(`currentCategoryid=${this.currentCategoryId}  pageNumber=${this.thePageNumber}`);
     

    // get theproducts for the given category id
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data=>{
    //      this.products=data;
    //   }
    // )

    this.productService.getProductListPaginate(this.thePageNumber-1,
                                                this.thePageSize,
                                                this.currentCategoryId).subscribe(this.processResult());

    }

    processResult(){
      return data=>{
        this.products=data._embedded.products;
        this.thePageNumber=data.page.number+1;
        this.thePageSize=data.page.size;
        this.theTotalElements=data.page.totalElements;
      }
    }

    updatePageSize(pageSize:number){
     
      this.thePageSize=pageSize;

      console.log(`pagesize=${this.thePageSize}`);
      this.thePageNumber=1;
      this.listProducts();
    }

    addToCart(theProduct:Product){
        console.log(`addedProduct=${theProduct.name} price=${theProduct.unitprice}`);

      //to do the real work
      const theCartItem = new CartItem(theProduct);
      this.cartService.addToCart(theCartItem);
    }


    

}



