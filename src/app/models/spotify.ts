export class SpotifyModel {

  constructor(public accessToken?: string, public name?: string){

  }

  setToken(token) {
    this.accessToken = token;
  }

  setName(name) {
    this.name = name;
  }
}
