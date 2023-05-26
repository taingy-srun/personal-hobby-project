import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AlbumsDataService } from '../albums/data/albums-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-adding-album',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.css']
})
export class AddingAlbumComponent {

  labelAddingNewAlbum = environment.label_adding_new_album;
  labelTitle = environment.label_title;
  labelReleasedDate = environment.label_released_date;
  labelBtnBack = environment.label_btn_back;
  labelBtnAdd = environment.label_btn_add;

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
      title: form.value.title,
      releaseDate: form.value.releaseDate
    }

    this._albumService.addOne(newAlbum).subscribe((next) => {
        this.gotoAlbumsPage();
    });
  }

  public gotoAlbumsPage(): void {
    this._router.navigate(["/albums"]);
  }

}
