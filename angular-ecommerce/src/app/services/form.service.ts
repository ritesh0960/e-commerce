import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  getCreditCardMonths(startMonth:number) : Observable<number[]>{

    let data:number[]=[];

    //build an array for month drop down list
    //- start at current month and loop until

    for(let theMonth=startMonth;theMonth<=12;theMonth++){
      data.push(theMonth);
    }
    return of(data);
    //The of operator from the rxjs will wrap up an object as an observable

    //Note:- we are using observable here because our angular component is going to subscribe to this method to receive the async data


  }

  getCreditCardYear():Observable<number[]>{
    let data:number[]=[];

    //building an array for year drop down list
    const startYear:number = new Date().getFullYear();
    const endYear:number=startYear+10;

    for(let theYear=startYear;theYear<=endYear;theYear++){
      data.push(theYear);
    }
    return of(data);

  }


}
