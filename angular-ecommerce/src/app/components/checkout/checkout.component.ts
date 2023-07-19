import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Countries } from 'src/app/common/countries';
import { Customer } from 'src/app/common/customer';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { States } from 'src/app/common/states';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormService } from 'src/app/services/form.service';
import { FormValidation } from 'src/app/validation/form-validation';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
      checkoutFormGroup:FormGroup;
      totalQuantity:number=0;
      totalPrice:number=0;

      creditCardYears:number[]=[];
      creditCardMonths:number[]=[];

      countries:Countries[]=[];
       shippingStates:States[]=[];
       billingStates:States[]=[];

       storage:Storage=sessionStorage;

      constructor(private formBuilder:FormBuilder,
                  private formService:FormService,
                  private cartService:CartService,
                  private checkoutService:CheckoutService,
                  private router:Router){};

      ngOnInit(): void {
       
        //retrieving the email id from the session storage
        const theEmail =JSON.parse(this.storage.getItem('theEmail'));
        //subscribing the value of total price and total quantity from cart services

        this.cartService.totalPrice.subscribe(

          
          data=>this.totalPrice=data
        
        );

        console.log(this.totalPrice);
  
        this.cartService.totalQuantity.subscribe(
          data=>this.totalQuantity=data
        );



        this.checkoutFormGroup=this.formBuilder.group({
          customer:this.formBuilder.group({
            firstName: new FormControl('',[Validators.required,Validators.minLength(2),FormValidation.notOnlyWhiteSpaces]),
            lastName:new FormControl('',[Validators.required,Validators.minLength(2),FormValidation.notOnlyWhiteSpaces]),
            email:new FormControl(theEmail,[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),FormValidation.notOnlyWhiteSpaces])
          }),
          shippingAddress:this.formBuilder.group({
            country:[''],
            state:[''],
            city:[''],
            street:[''],
            zipCode:['']
          }),
          billingAddress:this.formBuilder.group({
            country:[''],
            state:[''],
            city:[''],
            street:[''],
            zipCode:['']
          }),
          creditCard:this.formBuilder.group({
            cardType:[''],
            nameOnTheCard:[''],
            cardNumber:[''],
            securityCode:[''],
            expiryMonth:[''],
            expiryYear:['']
          })
        });
       //populate credit card months
        
      const startMonth:number=new Date().getMonth()+1;
      console.log("StartMonth: " + startMonth);

      this.formService.getCreditCardMonths(startMonth).subscribe(
        data=>{
          console.log("Retrived credit card month:" + JSON.stringify(data));
          this.creditCardMonths=data;
        }
      )

       // this.formService.getCreditCardMonths(startMonth);
       this.formService.getCreditCardYear().subscribe(
        data=>{
          console.log("Retrived credit card year :"+ JSON.stringify(data));
          this.creditCardYears=data;
        }
       )


       this.formService.getCountry().subscribe(
        data=>{
          this.countries=data;
          console.log(JSON.stringify(data));
        }
       )

      //  this.formService.getState().subscribe(
      //   data=>this.states=data
      //  );

      }

      onSubmit():void{

       if(this.checkoutFormGroup.invalid){
        this.checkoutFormGroup.markAllAsTouched();
        return;
       }

        // console.log("Handling the submit button");
        // console.log(this.checkoutFormGroup.get('customer').value);
        // console.log(this.checkoutFormGroup.get('shippingAddress').value);
        // console.log(this.checkoutFormGroup.get('billingAddress').value);
        // console.log(this.checkoutFormGroup.get('creditCard').value);

        
        //set up order
         let order = new Order();
         order.totalPrice=this.totalPrice;
         order.totalQuantity=this.totalQuantity;

        //get cart items
        const cartItem=this.cartService.cartItem;

        //create orderItem from cart-item
                /*(1)-long or conventional way
                   let orderItem :OrderItem[]=[];
                  cartItem.forEach(item=>{
                    orderItem.push(new OrderItem(item));
                  })*/

                  //(2)-short method

                  let orderItem:OrderItem[]=cartItem.map(tempCartItem=>new OrderItem(tempCartItem));

        //set up purchase
        let purchase =new Purchase();

        //populate purchase-customer
        let customer = new Customer();
        purchase.customer=this.checkoutFormGroup.controls['customer'].value;
        
        //populate purchase-shipping address
        purchase.shippingAddress=this.checkoutFormGroup.controls['shippingAddress'].value;
        const shippingState:States = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
        const shippingCountry:Countries=JSON.parse(JSON.stringify(purchase.shippingAddress.country));
        purchase.shippingAddress.state=shippingState.name;
        purchase.shippingAddress.country=shippingCountry.name;

        //populate purchase-billing address
        purchase.billingAddress=this.checkoutFormGroup.controls['billingAddress'].value;
        const billingState:States = JSON.parse(JSON.stringify(purchase.billingAddress.state));
        const billingCountry:Countries=JSON.parse(JSON.stringify(purchase.billingAddress.country));
        purchase.billingAddress.state=billingState.name;
        purchase.billingAddress.country=billingCountry.name;

        //populate purchase-order and order-item
        purchase.order=order;
        purchase.orderItems=orderItem;

        //call Rest API via the CheckOutService

        this.checkoutService.placeOrder(purchase).subscribe(
          {
            next:response=>{
              console.log(JSON.stringify(purchase));
              alert(`Your Order has been received\n Order Tracking number is : ${response.orderTrackingNumber}`);

              

              //reset cart
              this.resetCart();
            },
            error:err=>{
              alert(`There was an error ${err.message}`);
              console.log(`THE REASONS: ${JSON.stringify(purchase)}`);
            }
            
          }
        )


      
      }resetCart() {
        //reset cart items
        this.cartService.cartItem=[];
        this.cartService.totalPrice.next(0);
        this.cartService.totalQuantity.next(0);

        //reset the form
        this.checkoutFormGroup.reset();

        //route back to the product page
        this.router.navigateByUrl("/products");
  }
;

      get firstName(){return this.checkoutFormGroup.get('customer.firstName')};
      get lastName(){return this.checkoutFormGroup.get('customer.lastName')};
      get email(){return this.checkoutFormGroup.get('customer.email')};

      copyShippingAddressToBillingAddress(event){
        if(event.target.checked){
            this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

            //to assign shippingAddressState to billingAddressState
            this.billingStates=this.shippingStates;
        }
        else{
          this.checkoutFormGroup.controls['billingAddress'].reset();

          //msking billingaddressState empty
          this.billingStates=[];
        }
      }

      handleMonthsAndYears():void{
        const creditCardFormGroup=this.checkoutFormGroup.get('creditCard');
        const currentYear:number=new Date().getFullYear();
        const selectedYear:number=Number(creditCardFormGroup.value.expiryYear);

        //if the current year equals selected year then start with the current month
        let startMonth:number;

        if(currentYear==selectedYear){
          startMonth=new Date().getMonth()+1;
        }
        else
        {
          startMonth=1;
        }


        this.formService.getCreditCardMonths(startMonth).subscribe(
          data=>{
            console.log("retrived month: " + JSON.stringify(data));
            this.creditCardMonths=data;
          }
        )


      }

      handleStates():void{
           const shippingAddressFormGroup=this.checkoutFormGroup.get('shippingAddress');

           const selectedCountryCode=shippingAddressFormGroup.value.country.code;
           console.log("Selected country code" + selectedCountryCode);
           this.formService.getState(selectedCountryCode).subscribe(
            data=>{
              this.shippingStates=data;
              console.log("retrived state : "+ JSON.stringify(data));
            }
           );
          }

          handleStatesBilling():void{
            const billingAddressFormGroup=this.checkoutFormGroup.get('billingAddress');
 
            const selectedCountryCode=billingAddressFormGroup.value.country.code;
            console.log("Selected country code" + selectedCountryCode);
            this.formService.getState(selectedCountryCode).subscribe(
             data=>{
               this.billingStates=data;
               console.log("retrived state : "+ JSON.stringify(data));
             }
            );
          }

      



      

}

