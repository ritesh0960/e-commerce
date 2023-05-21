import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Countries } from '../common/countries';
import { States } from '../common/states';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private httpClient:HttpClient) { }

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


  private countryUrl="http://localhost:1000/api/countries";
  //private testUrl="http://localhost:1000/api/states";
  private stateUrl="http://localhost:1000/api/states/search/findByCountryCode";

  getCountry():Observable<Countries[]>{
      return this.httpClient.get<GetResponseCountry>(this.countryUrl).pipe(
        map(response=>response._embedded.countries)
      );
  }

  getState(countryCode:String):Observable<States[]>{
    
    const stateUrlWithCountryCode = `${this.stateUrl}?code=${countryCode}`
    return this.httpClient.get<GetResponseState>(stateUrlWithCountryCode).pipe(
      map(response=>response._embedded.states)
    );
  }


}

interface GetResponseCountry{
  _embedded:{
    countries:Countries[];
  }
}

interface GetResponseState{
  _embedded:{
    states:States[];
  }
}
