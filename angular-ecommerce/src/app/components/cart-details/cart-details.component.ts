import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  
  cartItems:CartItem[]=[];
  totalPrice:number=0;
  totalQuantity:number=0;

  constructor(private cartService:CartService){};
  
  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    //get a handle to the cart items
    this.cartItems=this.cartService.cartItem;
    //subscribe to the data total quantity
    this.cartService.totalQuantity.subscribe(
      data=>this.totalQuantity=data
    )
   //subscribe to the data total price
   this.cartService.totalPrice.subscribe(
    data=>this.totalPrice=data
   )

   //compute cart total price and total quantity
   this.cartService.computeCartTotals();

  }

  increamentQuantity(theCartItem:CartItem){
          this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem){
    this.cartService.decrementQuantity(theCartItem);
  }

  removeItem(theCartItem:CartItem){
    this.cartService.removeItem(theCartItem);
  }

}
