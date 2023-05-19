import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

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

      constructor(private formBuilder:FormBuilder,
                  private formService:FormService){};

      ngOnInit(): void {
        this.checkoutFormGroup=this.formBuilder.group({
          customer:this.formBuilder.group({
            firstName:[''],
            lastName:[''],
            email:['']
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

      }

      onSubmit():void{
        console.log("Handling the submit button");
        console.log(this.checkoutFormGroup.get('customer').value);
        console.log(this.checkoutFormGroup.get('shippingAddress').value);
        console.log(this.checkoutFormGroup.get('billingAddress').value);
        console.log(this.checkoutFormGroup.get('creditCard').value);
      
      };

      copyShippingAddressToBillingAddress(event){
        if(event.target.checked){
            this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        }
        else{
          this.checkoutFormGroup.controls['billingAddress'].reset();
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

      

}

