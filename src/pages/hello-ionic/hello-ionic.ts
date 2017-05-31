import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SpotifyService } from '../../app/services/spotify-service';
import { SpotifyModel } from '../../app/models/spotify';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
  providers: [SpotifyService]
})
export class HelloIonicPage {
  constructor(private navCtrl: NavController, private platform: Platform,
              private _spotifyService: SpotifyService, public storage: Storage) { }

  private _spotifyModel = new SpotifyModel();
  errorMessage: string;
  ngOnInit() {
    this.platform.ready().then(() => {
      this.storage.get('user').then((data) => {
        this._spotifyModel.setToken(data.accessToken);
        this._spotifyModel.setName(data.name);
        console.log(this._spotifyModel.name);
        console.log(this._spotifyModel.accessToken);
      });
    });
  }
  public spotify() {
    this.platform.ready().then(() => {
      if(this._spotifyModel.hasInvalidAccessToken()) {
        this._spotifyService.getAccessToken().then((response) => {
          this._spotifyModel.setToken(response['access_token']);

          this._spotifyService.getMe(this._spotifyModel.accessToken).subscribe(
            data => {
              this._spotifyModel.setName(data['id'])
              this.storage.set('user', this._spotifyModel);
            }
          );
        });
      }
    });
  }
}
