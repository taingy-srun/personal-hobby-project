import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  name: string = "";

  constructor(private _jwtHelper: JwtHelperService) { }

  ngOnInit() {
    console.log(this.token);
  }

  getName(): string {
    if (this.token) {
      const payload = this._jwtHelper.decodeToken(this.token);
      this.name = payload.name;
    }
    return this.name;
  }

  isLoggedIn(): boolean {
    if(null !== this.token) {
      return true;
    }
    return false;
  }

  get token() {
    return localStorage.getItem("token") as string;
  }

  setToken(token: string) {
    localStorage.setItem("token", token);
  }

  logout() {
    localStorage.clear();
  }
}
