import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserDataService } from '../user/user-data.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { Credential } from '../user/credential-model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  labelUsername = environment.label_username;
  labelPassword = environment.label_password;
  labelLogin = environment.label_login;

  loginForm!: FormGroup;

  username!: string;
  password!: string;

  constructor(private _userService: UserDataService, private _authenticationService: AuthenticationService, private _router: Router) {}

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
    this.username = this.loginForm.value.username;
    this.password = this.loginForm.value.password;
  }


  private _checkFieldsEmpty() {
    if (!this.username || !this.password) {
      return false;
    } else {
      return true;
    }
  }

  private _login() {
    const user = new Credential(this.username, this.password);
    this._userService.login(user).subscribe({
      next: (user) => this._onLoginSuccess(user),
      error: (error) => this._onLoginFailed(error)
    });
  }

  public login() {
    this._setValue();
    
    if (!this._checkFieldsEmpty()) {
      alert(environment.msg_input_all_fields);
    } 

    this._login();
  }

  private _onLoginFailed(error: any) {
    alert(JSON.stringify(error.error));
  }
 
  private _onLoginSuccess(user: any) {
    this._setAuthenticationData(user);
    this._goHome();
  }

  private _goHome() {
    this._router.navigate(["/"]);
  }

  private _setAuthenticationData(user: any) {
    this._authenticationService.setToken(user.token);
  }
}
