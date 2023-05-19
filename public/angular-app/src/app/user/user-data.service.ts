import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from './user-model';



@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  _baseUrl: string = "http://localhost:3000/api/users";

  constructor(private _http: HttpClient) { }

  public register(user: any): Observable<User> {
    return this._http.post<User>(this._baseUrl, user);   
  }

  public login(user: any): Observable<User> {
    return this._http.post<User>(this._baseUrl + "/login", user);
  }
}
