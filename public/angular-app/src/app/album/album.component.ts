import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

import { Album } from '../albums/data/album-model';
import { AlbumsDataService } from '../albums/data/albums-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent {
  
  labelTitle = environment.label_title;
  labelReleasedDate = environment.label_released_date;
  labelActions = environment.label_actions;
  labelBtnBack = environment.label_btn_back;
  labelBtnEdit = environment.label_btn_edit;
  labelBtnDelete = environment.label_btn_delete;
  labelAddNewSong = environment.label_add_new_song;
  labelListOfsong = environment.label_song_list;

  album!: Album;

  constructor(private _albumService: AlbumsDataService, private _route: ActivatedRoute, private _authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.getAlbum();
  }

  private getAlbum() {
    const _id = this._route.snapshot.params["albumId"];
    this._albumService.getOne(_id).subscribe({
        next: (album) => {
          this.album = album;
        },
        error: (err) => {
          console.log(err);
        }
    });
  }

  public deleteOneSong(songId: string) {
    const albumId = this._route.snapshot.params["albumId"];
    this._albumService.deleteOneSong(albumId, songId).subscribe({
        next: (album) => {
          this.ngOnInit();
        },
        error: (err) => {
          console.log(err);
        }
    });
  }

  public isLoggedIn() {
    return this._authenticationService.isLoggedIn();
  }

}
