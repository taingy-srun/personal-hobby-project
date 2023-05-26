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

  _baseUrl: string = environment.api_base_url + environment.endpoint_users;

  constructor(private _http: HttpClient) { }

  public register(user: User): Observable<User> {
    return this._http.post<User>(this._baseUrl, user.toJSON());   
  }

  public login(user: Credential): Observable<User> {
    const url = this._baseUrl + environment.endpoint_login;
    return this._http.post<User>(url, user.toJSON());
  }
}
