import { Component } from '@angular/core';
import { AlbumsDataService } from '../albums/albums-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Album } from '../albums/albums.component';

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.component.html',
  styleUrls: ['./edit-album.component.css']
})
export class EditAlbumComponent {

  album!: Album;
  albumId!: string;
  albumForm!: FormGroup;

  constructor(private _albumService: AlbumsDataService, private _route: ActivatedRoute, private _router: Router){}

  ngOnInit() {
    this._setAlbumId();     
    this._initFrom();
    this._getAlbum();
  }

  private _setAlbumId() {
    this.albumId = this._route.snapshot.params["albumId"];
  }

  private _initFrom() {
    this.albumForm = new FormGroup({
      title: new FormControl(),
      releaseDate: new FormControl()
    });
  }

  private _getAlbum() {
    this._albumService.getOne(this.albumId).subscribe({
      next: (album) => { 
        this._setValueFrom(album);
      }
    });
  }

  private _setValueFrom(album: Album) {
    this.albumForm = new FormGroup({
      title: new FormControl(album.title),
      releaseDate: new FormControl(new Date(album.releaseDate).toISOString().split('T')[0])
    });
  }

  public save(){
    const album = {
      title: this.albumForm.value["title"],
      releaseDate: this.albumForm.value["releaseDate"]
    }

    this._albumService.updateOne(this.albumId, album).subscribe((next) => {
        this.gotoAlbumsPage();
    });
  }

  public gotoAlbumsPage(): void {
    this._router.navigate(["/albums"]);
  }
}
