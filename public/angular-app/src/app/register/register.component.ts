import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserDataService } from '../user/user-data.service';
import { Router } from '@angular/router';
import { User } from '../user/user-model';

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

  successMessage: string = "";
  errorMessage: string = "";
  isSuccess: boolean = false;
  isError: boolean = false;

  constructor(private _userService: UserDataService, private _router: Router) {}

  ngOnInit() { }

  private _register() {
    const user = new User(this.name, this.username, this.password);
    this._userService.register(user).subscribe({
      next: (user) =>  this._onRegisterSuccess(),
      error: (error) => this._onRegisterFailed(error)
    });
  }

  public register() {
    if (!this._checkFieldsEmpty()) {
      alert("Please input all the fields!");
    }
    if (!this._isPasswordMatch()) {
      alert("The confirm password is not matched!");
      return;
    }

    this._register();
  }

  private _checkFieldsEmpty() {
    if (!this.name || !this.username || !this.password) {
      return false;
    } else {
      return true;
    }
  }

  private _isPasswordMatch() {
    if (this.password !== this.confirmPassword) {
      return false;
    } else {
      return true;
    }
  }

  private _clearForm() {
    this.name = "";
    this.username = "";
    this.password = "";
    this.confirmPassword = "";
  }

  private _onRegisterFailed(error: any) {
    console.log(error);
  
    this.successMessage = "";
    this.errorMessage = "Failed to register!";
    this.isSuccess = false;
    this.isError = true;
  }

  private _onRegisterSuccess() {
    this._clearForm();
    this.successMessage = "User register successful!";
    this.errorMessage = "";
    this.isSuccess = true;
    this.isError = false;
  }

}
