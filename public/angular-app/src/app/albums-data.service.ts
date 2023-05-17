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

  public getByPage(offset: number, count: number): Observable<Album[]> {
    return this._http.get<Album[]>(this._baseUrl + "?offset=" + offset + "&count=" + count);
  }

  public getOne(_id: string): Observable<Album> {
    return this._http.get<Album>(this._baseUrl + "/" + _id);
  }

  public deleteOne(_id: string): Observable<Album> {
    return this._http.delete<Album>(this._baseUrl + "/" + _id);
  }

  public addOne(album: any): Observable<Album> {
    return this._http.post<Album>(this._baseUrl, album);
  }

  public addOneSong(_albumId: string, song: any): Observable<Album> {
    const url: string = this._baseUrl + "/" + _albumId + "/songs"
    return this._http.post<Album>(url, song);
  }

  public deleteOneSong(_albumId: string, songId: string): Observable<Album> {
    const url: string = this._baseUrl + "/" + _albumId + "/songs/" + songId;
    return this._http.delete<Album>(url);
  }
}
