import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserDataService } from '../user/user-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  loginForm!: FormGroup;

  username!: string;
  password!: string;

  constructor(private _userService: UserDataService, private _router: Router) {}

  ngOnInit() {
    this._initFrom();
  }

  private _initFrom() {
    this.loginForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });
  }

  private _setValue() {
    this.username = this.loginForm.value["username"];
    this.password = this.loginForm.value["password"];
  }


  private _checkFieldsEmpty() {
    if (!this.username || !this.password) {
      return false;
    } else {
      return true;
    }
  }

  private _login() {
    const user = {
      username: this.username,
      password: this.password
    }

    this._userService.login(user).subscribe({
      next: (user) => this._onLoginSuccess(),
      error: (error) => this._onLoginFailed(error)
    });
  }

  public login() {
    this._setValue();
    
    if (!this._checkFieldsEmpty()) {
      alert("Please input all the fields!");
    } 

    this._login();
  }

  private _onLoginFailed(error: any) {
    alert(JSON.stringify(error["error"]));
  }
 
  private _onLoginSuccess() {
    alert("Login successfully!");
    this._goHome();
  }

  private _goHome() {
    this._router.navigate(["/"]);
  }
}
