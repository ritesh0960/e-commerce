import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItem:CartItem[]=[];
  
  totalPrice:Subject<number> = new Subject<number>();
  totalQuantity:Subject<number>=new Subject<number>();

  constructor() { }

  addToCart(theCartItem:CartItem){
         //check we already have the item in the cart
         let alreadyExistsInCart:boolean=false;
         let existingCartItem:CartItem=undefined;

         if(this.cartItem.length>0){
          //find the item in the cart based on item id
          // for(let tempCartItem of this.cartItem){
          //   if(tempCartItem.id===theCartItem.id){
          //     existingCartItem=tempCartItem;
          //   }
          //   break;
          // }

          existingCartItem=this.cartItem.find(tempCartItem=>tempCartItem.id===theCartItem.id);
            
          //check if we found it
          alreadyExistsInCart=(existingCartItem!=undefined);

         }

         if(alreadyExistsInCart){
          //increase the quantity
          existingCartItem.quantity++;
         }
         else{
          //just add the item to the array
          this.cartItem.push(theCartItem);
         }

         this.computeCartTotals()
  }
  computeCartTotals() {
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;
    for(let currentCartItem of this.cartItem){
      totalPriceValue+=currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue+=currentCartItem.quantity;
    }
    //publish the new values....all subscribers will receive the new data
  
    this.totalPrice.next(Math.round(totalPriceValue));
    this.totalQuantity.next(totalQuantityValue);

    //log cart value just for debugging purpose
    this.logCartData(totalPriceValue,totalQuantityValue);
}
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`contents of the cart`);
    for(let tempCartItem of this.cartItem){
      const subTotalPrice=tempCartItem.quantity*tempCartItem.unitPrice;
      console.log(`name=${tempCartItem.name} quantity=${tempCartItem.quantity} unitPrice=${tempCartItem.unitPrice} subtotalPrice=${subTotalPrice.toFixed(2)}`);
     
    }
    console.log(`totalQuantity=${totalQuantityValue} totalPrice=${totalPriceValue}`);
    console.log(`-------------------------------`);
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity==0){
      this.removeItem(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }
  removeItem(theCartItem: CartItem) {
    //get the index of the array in Cart item
    const itemIndex=this.cartItem.findIndex(
      tempCartItem=>tempCartItem.id==theCartItem.id
    )

    //if found remove the item from the cart
    if(itemIndex!=-1){
      this.cartItem.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }

}

