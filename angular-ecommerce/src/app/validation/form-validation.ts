import { FormControl, ValidationErrors } from "@angular/forms";


export class FormValidation {

    //whiteSpace Validation

    static notOnlyWhiteSpaces(control:FormControl):ValidationErrors{
       
        if((control.value!=null) && (control.value.trim().length===0)){

            //invalid return error object

            return {'notOnlyWhiteSpaces':true};
        }

        else{
            return null;
        }
    }
}
