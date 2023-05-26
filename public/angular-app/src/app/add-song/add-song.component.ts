import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlbumsDataService } from '../albums/data/albums-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css']
})
export class AddSongComponent {

  labelAddingNewSong = environment.label_adding_new_song;
  labelTitle = environment.label_title;
  labelBtnBack = environment.label_btn_back;
  labelBtnAdd = environment.label_btn_add;

  newSongForm!: FormGroup;

  albumId!: string;

  constructor(private _albumService: AlbumsDataService, private _route: ActivatedRoute, private _router: Router){}

  ngOnInit() {
    this.newSongForm = new FormGroup({
      title: new FormControl()
    });
  }

  public add(form: FormGroup){
    const newSong = {
      title: form.value.title
    }

    this.albumId = this._route.snapshot.params["albumId"];
    this._albumService.addOneSong(this.albumId, newSong).subscribe((next) => {
      this.gotoAlbumPage();
    });
  }

  public gotoAlbumPage(): void {
    this._router.navigate(["/albums/" + this.albumId]);
  }
}
