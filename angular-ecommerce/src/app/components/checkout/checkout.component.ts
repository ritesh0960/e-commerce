import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Countries } from 'src/app/common/countries';
import { States } from 'src/app/common/states';
import { CartService } from 'src/app/services/cart.service';
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

      constructor(private formBuilder:FormBuilder,
                  private formService:FormService,
                  private cartService:CartService){};

      ngOnInit(): void {
       

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
            email:new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),FormValidation.notOnlyWhiteSpaces])
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
       }

        console.log("Handling the submit button");
        console.log(this.checkoutFormGroup.get('customer').value);
        console.log(this.checkoutFormGroup.get('shippingAddress').value);
        console.log(this.checkoutFormGroup.get('billingAddress').value);
        console.log(this.checkoutFormGroup.get('creditCard').value);
      
      };

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

