import { Song } from "./song-model";

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