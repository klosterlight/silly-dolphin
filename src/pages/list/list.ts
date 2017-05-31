import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SpotifyService } from '../../app/services/spotify-service';
import { SpotifyModel } from '../../app/models/spotify';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [SpotifyService]
})
export class ListPage {
  items: Array<{title: string, note: string, icon: string}>;
  playLists: Array<{name: string, id: string, author: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storage: Storage,private _spotifyService: SpotifyService,
              private platform:Platform) { }

  private _spotifyModel = new SpotifyModel();

  ngOnInit(){
    this.platform.ready().then(() => {
      this.storage.get('user').then((data) => {
        this._spotifyModel.setToken(data.accessToken);
        this.playList();
      });
    });
  }
  playList() {
    this.playLists = [];
    console.log(this._spotifyModel.accessToken);
    this._spotifyService.getPlay(this._spotifyModel.accessToken).subscribe(
      res => {
        res['items'].forEach((x:any) => {
          this.playLists.push({
            name: x.name,
            id: x.id,
            author: x.owner.id
          });
        })
      }
    );
  }
}
