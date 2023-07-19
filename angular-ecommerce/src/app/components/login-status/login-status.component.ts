import { Component, Inject, OnInit, inject } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService  } from '@okta/okta-angular';
//import { OktaAuthStateService } from '@okta/okta-angular/src/okta/services/auth-state.service';
import {OktaAuth} from '@okta/okta-auth-js'

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated:boolean=false;
  userFullName:string='';
  theEmail:String='';
  storage:Storage=sessionStorage;
  constructor(@Inject(OKTA_AUTH) private oktaAuth:OktaAuth,
  private oktaAuthService:OktaAuthStateService){}
 
  ngOnInit(): void {
    //subscribe to authentication state change
     
    this.oktaAuthService.authState$.subscribe(
      (result)=>{
        this.isAuthenticated=result.isAuthenticated!;
        this.getUserDetails();
      }
    )

  }
  getUserDetails() {
    if(this.isAuthenticated){
      //fetch the logged in user details
      //
      //user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res)=>{
          this.userFullName=res.name as string;

          //retrieve the email address of the user
          this.theEmail=res.email;

          //storing the email to the session storage

          this.storage.setItem('theEmail',JSON.stringify(this.theEmail));
        }
      )
     

    }
  }

 logout(){
  //terminate the sessions with okta and remove the current tokens
   this.oktaAuth.signOut();
 };

}
