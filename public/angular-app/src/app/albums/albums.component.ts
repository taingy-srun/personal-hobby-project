import { Component } from '@angular/core';
import { AlbumsDataService } from '../albums-data.service';

class Song {
  #title!: string;
  #duration!: number;

  get title(): string {
    return this.#title;
  }
  set title(title: string) {
    this.#title = title;
  }
  get duration(): number {
    return this.#duration;
  }
  set duration(duration: number) {
    this.#duration = duration;
  }
}

export class Album {
  #_id!: string;
  #title!: string;
  #releaseDate!: Date;
  #songs!: Song[];

  get _id(): string {
    return this.#_id;
  }
  get title(): string {
    return this.#title;
  }
  set title(title: string) {
    this.#title = title;
  }
  get releaseDate(): Date {
    return this.#releaseDate;
  }
  set releaseDate(releaseDate: Date) {
    this.#releaseDate = releaseDate;
  }
  get songs(): Song[] {
    return this.#songs;
  }
}


@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent {

  albums!: Album[];

  constructor(private _albumService: AlbumsDataService) {

  }

  ngOnInit(): void {
    this._albumService.getAll().subscribe({
        next: (albums) => {
          this.albums = albums;
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
