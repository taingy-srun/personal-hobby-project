import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlbumsDataService } from '../albums-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css']
})
export class AddSongComponent {
  
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
      title: form.value["title"]
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
