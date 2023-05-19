export class User {
  #name!: string;
  #username!: string;
  #password!: string;

  get name(): string {
    return this.#name;
  }
  set name(name:string) {
    this.#name = name;
  }

  get username(): string {
    return this.#username;
  }
  set username(username: string) {
    this.#username = username;
  }

  get password(): string {
    return this.#password;
  }
  set password(password: string) {
    this.#password = password;
  }
}
  