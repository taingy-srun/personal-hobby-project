import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserDataService } from '../user/user-data.service';
import { Router } from '@angular/router';

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


  constructor(private _userService: UserDataService, private _router: Router) {}

  ngOnInit() { }

  private _register() {
    const user = {
      name: this.name,
      username: this.username,
      password: this.password
    }

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
    alert(JSON.stringify(error["error"]));
  }

  private _onRegisterSuccess() {
    alert("User register successful!");
    this._clearForm();
    this.gotoLogin();
  }


  private gotoLogin() {
    this._router.navigate(["/login"]);
  }
}
