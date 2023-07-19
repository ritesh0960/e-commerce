import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/common/order';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit{
      orderHistory:OrderHistory[]=[];
      storage:Storage = sessionStorage;
      
      constructor(private orderService:OrderHistoryService){};
      ngOnInit(): void {
         this.getOrders();
         console.log("the order History: " + JSON.stringify(this.orderHistory));
      }

      getOrders(){
        const  theEmail:String=JSON.parse(this.storage.getItem('theEmail'));
        console.log("the email is " + theEmail);
        this.orderService.getOrderHistory(theEmail).subscribe(
          data=>{
              this.orderHistory=data._embedded.orders;
              console.log(data);
              console.log(this.orderHistory);
            }
          )
      }
}
