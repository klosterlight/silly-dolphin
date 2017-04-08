import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { Spotify } from 'ng2-cordova-oauth/core';
import {OauthCordova} from 'ng2-cordova-oauth/platform/cordova'

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  private oauth: OauthCordova = new OauthCordova();
  private spotifyProvder: Spotify =  new Spotify({
    clientId: "c70714997a0843f59b778597b6afc0c2",
    appScope: ["user-read-private", "playlist-read-private"]
  })
  constructor(private navCtrl: NavController, private platform: Platform) { }

  public spotify() {
    console.log("De perdido entra aqui?");
    this.platform.ready().then(() => {
      this.oauth.logInVia(this.spotifyProvder).then(success => {
        console.log("RESULT: " + JSON.stringify(success));
      }, error => {
        console.log("ERROR: ", error);
      });
    });
  }
}
