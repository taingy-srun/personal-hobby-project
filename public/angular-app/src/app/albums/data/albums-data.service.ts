import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Album } from './album-model';
import { Song } from './song-model';

@Injectable({
  providedIn: 'root'
})
export class AlbumsDataService {

  _baseUrl: string = environment.api_base_url + environment.endpoint_albums;
  _songsEndpoint: string = environment.endpoint_songs;

  constructor(private _http: HttpClient) {}

  public getAll(offset: number, count: number, search: string): Observable<Album[]> {
    const url = this._baseUrl + "?offset=" + offset + "&count=" + count + "&search=" + search;
    return this._http.get<Album[]>(url);
  }

  public getOne(_id: string): Observable<Album> {
    const url = this._baseUrl + "/" + _id
    return this._http.get<Album>(url);
  }

  public updateOne(_id: string, album: any): Observable<Album> {
    const url = this._baseUrl + "/" + _id;
    return this._http.patch<Album>(url, album);
  }

  public deleteOne(_id: string): Observable<Album> {
    const url = this._baseUrl + "/" + _id;
    return this._http.delete<Album>(url);
  }

  public addOne(album: any): Observable<Album> {
    return this._http.post<Album>(this._baseUrl, album);
  }

  public getOneSong(_albumId: string, _songId: string): Observable<Song> {
    const url = this._baseUrl + "/" + _albumId + this._songsEndpoint + "/" + _songId;
    return this._http.get<Song>(url);
  }

  public updateOneSong(_albumId: string, _songId: string, _song: any): Observable<Song> {
    const url = this._baseUrl + "/" + _albumId + this._songsEndpoint + "/" + _songId;
    return this._http.put<Song>(url, _song);
  }

  public addOneSong(_albumId: string, song: any): Observable<Album> {
    const url: string = this._baseUrl + "/" + _albumId + this._songsEndpoint;
    return this._http.post<Album>(url, song);
  }

  public deleteOneSong(_albumId: string, songId: string): Observable<Album> {
    const url: string = this._baseUrl + "/" + _albumId + this._songsEndpoint + "/" + songId;
    return this._http.delete<Album>(url);
  }
}
