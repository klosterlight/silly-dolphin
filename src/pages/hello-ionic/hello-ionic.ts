import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { SpotifyService } from '../../app/services/spotify-service';
import { SpotifyModel } from '../../app/models/spotify';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
  providers: [SpotifyService]
})
export class HelloIonicPage {
  constructor(private navCtrl: NavController, private platform: Platform, private _spotifyService: SpotifyService) { }

  private _spotifyModel = new SpotifyModel();
  errorMessage: string;
  public spotify() {
    var token: string ='';

    this.platform.ready().then(() => {
      this._spotifyService.getAccessToken().then((response) => {
        token = response['access_token'];
        console.log(token);
        this._spotifyService.getMe(token).subscribe();
      });
    });
  }
}
