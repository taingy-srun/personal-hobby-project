import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Album } from './albums/albums.component';

@Injectable({
  providedIn: 'root'
})
export class AlbumsDataService {

  _baseUrl:string = "http://localhost:3000/api/albums";
  constructor(private _http: HttpClient) {}

  public getAll(): Observable<Album[]> {
    return this._http.get<Album[]>(this._baseUrl);
  }

  public getOne(_id: string): Observable<Album> {
    return this._http.get<Album>(this._baseUrl + "/" + _id);
  }

  public deleteOne(_id: string): Observable<Album> {
    return this._http.delete<Album>(this._baseUrl + "/" + _id);
  }
}
