import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-adding-album',
  templateUrl: './adding-album.component.html',
  styleUrls: ['./adding-album.component.css']
})
export class AddingAlbumComponent {

  newAlbumForm!: FormGroup;

  constructor(){}

  ngOnInit() {
    this.newAlbumForm = new FormGroup({
      title: new FormControl(),
      releaseDate: new FormControl()
    });
  }

  public add(form: FormGroup){
    console.log(form.value);
  }
}
