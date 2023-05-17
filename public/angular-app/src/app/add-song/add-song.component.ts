import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlbumsDataService } from '../albums-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css']
})
export class AddSongComponent {
  @Input()
  albumId!: string;
  newSongForm!: FormGroup;

  constructor(private _albumService: AlbumsDataService, private _router: Router){}

  ngOnInit() {
    this.newSongForm = new FormGroup({
      title: new FormControl()
    });
  }

  public add(form: FormGroup){
    const newSong = {
      title: form.value["title"]
    }

    this._albumService.addOneSong(this.albumId, newSong).subscribe((next) => {
        this.afterAdded();
    });
  }

  public gotoAlbumPage(): void {
    this._router.navigate(["/albums"]);
  }

  private afterAdded() {
    alert("Song added!");
    // this.gotoAlbumPage();
  }
}
