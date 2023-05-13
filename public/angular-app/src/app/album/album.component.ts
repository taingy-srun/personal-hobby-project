import { Component } from '@angular/core';
import { Album } from '../albums/albums.component';
import { AlbumsDataService } from '../albums-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent {

  album!: Album;

  constructor(private _albumService: AlbumsDataService, private _route: ActivatedRoute) {}

  ngOnInit() {
    const _id = this._route.snapshot.params["albumId"];
    this._albumService.getOne(_id).subscribe({
        next: (album) => {
          this.album = album;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log("On complete");
        }
    });
  }
}
