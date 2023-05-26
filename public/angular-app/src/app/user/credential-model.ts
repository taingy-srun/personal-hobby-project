export class Credential {
  
    #username!: string;
    #password!: string;
  
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

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    toJSON() {
        return {
            "username": this.#username,
            "password": this.#password
        }
    }
  }
    