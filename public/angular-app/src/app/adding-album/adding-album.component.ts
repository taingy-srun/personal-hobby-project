import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlbumsDataService } from '../albums-data.service';
import { Album } from '../albums/albums.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adding-album',
  templateUrl: './adding-album.component.html',
  styleUrls: ['./adding-album.component.css']
})
export class AddingAlbumComponent {

  newAlbumForm!: FormGroup;

  constructor(private _albumService: AlbumsDataService, private _router: Router){}

  ngOnInit() {
    this.newAlbumForm = new FormGroup({
      title: new FormControl(),
      releaseDate: new FormControl()
    });
  }

  public add(form: FormGroup){
    const newAlbum = {
      title: form.value["title"],
      releaseDate: form.value["releaseDate"]
    }

    this._albumService.addOne(newAlbum).subscribe((next) => {
        this.gotoAlbumsPage();
    });
  }

  public gotoAlbumsPage(): void {
    this._router.navigate(["/albums"]);
  }

}
