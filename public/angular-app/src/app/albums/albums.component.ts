import { Component } from '@angular/core';
import { AlbumsDataService } from '../albums-data.service';

export class Song {
  #_id!: string;
  #title!: string;
  #duration!: number;

  get _id(): string {
    return this.#_id;
  }
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

  offset: number = 0;
  count: number = 5;

  constructor(private _albumService: AlbumsDataService) {}

  ngOnInit(): void {
    this.getAlbums();
  }

  public getAlbums() {
    this._albumService.getByPage(this.offset, this.count).subscribe({
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

  public getNextPage() {
    this.setNextPageValue();
    this.getAlbums();
  }

  public getPreviousPage() {
    this.setPreviousPageValue();
    this.getAlbums();
  }

  private setNextPageValue() {
    this.offset += this.count;
  }

  private setPreviousPageValue() {   
    if (this.offset > 0) {
      this.offset -= this.count;
    } else {
      this.offset = 0;
    }

    if (this.offset < 0) {
      this.offset = 0;
    }
  }

  public disablePreviousButton():boolean {
      return this.offset == 0;
  }

  public disableNextButton():boolean {
    if (!this.albums) {
      return false;
    }
    return this.albums.length < 5;
  }

  public delete(id: string) {
    this._albumService.deleteOne(id).subscribe({
      next: (deleted) => {
        this.ngOnInit();
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
