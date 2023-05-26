import { Component } from '@angular/core';
import { AlbumsDataService } from '../albums/albums-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Song } from '../albums/albums.component';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.css']
})
export class EditSongComponent {

  albumId!: string;
  songId!: string;
  songForm!: FormGroup;

  constructor(private _albumService: AlbumsDataService, private _route: ActivatedRoute, private _router: Router){}

  ngOnInit() {
    this._setValue();     
    this._initFrom();
    this._getAlbum();
  }

  private _setValue() {
    this.songId = this._route.snapshot.params["songId"];
    this.albumId = this._route.snapshot.params["albumId"];
  }

  private _initFrom() {
    this.songForm = new FormGroup({
      title: new FormControl()
    });
  }

  private _getAlbum() {
    this._albumService.getOneSong(this.albumId, this.songId).subscribe({
      next: (song) => { 
        this._setValueFrom(song);
      }
    });
  }

  private _setValueFrom(song: Song) {
    this.songForm = new FormGroup({
      title: new FormControl(song.title),
    });
  }

  public save(){
    const song = {
      title: this.songForm.value["title"],
    }

    this._albumService.updateOneSong(this.albumId, this.songId, song).subscribe((next) => {
        this.gotoAlbumPage();
    });
  }

  public gotoAlbumPage(): void {
    this._router.navigate(["/albums/" + this.albumId]);
  }

}
