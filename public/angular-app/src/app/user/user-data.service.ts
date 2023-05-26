import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from './user-model';
import { environment } from 'src/environments/environment';
import { Credential } from './credential-model';



@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  _baseUrl: string = environment.API_BASE_URL + environment.USERS_ENDPOINT;

  constructor(private _http: HttpClient) { }

  public register(user: User): Observable<User> {
    return this._http.post<User>(this._baseUrl, user.toJSON());   
  }

  public login(user: Credential): Observable<User> {
    const url = this._baseUrl + environment.LOGIN_ENDPOINT;
    return this._http.post<User>(url, user.toJSON());
  }
}
