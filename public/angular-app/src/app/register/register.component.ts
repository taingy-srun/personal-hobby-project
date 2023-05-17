import { Component, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  @ViewChild("registerForm")
  registerForm!: NgForm;
  
  name!: string;
  username!: string;
  password!: string;
  confirmPassword!: string;


  constructor() {}

  ngOnInit() {
   
  }

  public register() {
    // console.log(form.value);
    console.log(this.registerForm.value);
    
  }


}
