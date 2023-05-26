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
  