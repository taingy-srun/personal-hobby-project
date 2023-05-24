import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  name!: string;
  token!: string;

  constructor() { }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getToken(): string {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
  }

  isLogin() {
    if (!this.token) {
      return false;
    } else {
      return true; 
    }
  }

}
