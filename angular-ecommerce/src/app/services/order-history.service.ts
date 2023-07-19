import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Order } from '../common/order';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

 // private orders[]:Order=[];
   
  private baseUrl ="http://localhost:1000/api/orders/search/findByCustomerEmail";

  constructor(private httpClient:HttpClient) { }

  getOrderHistory(theEmail:String):Observable<GetResponseOrderHistory>{
    const searchUrl=`${this.baseUrl}?email=${theEmail}`;
   return  this.httpClient.get<GetResponseOrderHistory>(searchUrl);
  }
}

interface GetResponseOrderHistory{
  _embedded:{
    orders: OrderHistory[];
  } ,
  page :{
    size :number,
    totalElements:number,
    totalPages:number,
    number:number
  };
}
