import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController, ActionSheetController,
         AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SpotifyService } from '../../app/services/spotify-service';
import { SpotifyModel } from '../../app/models/spotify';
import { ItemDetailsPage } from '../item-details/item-details';
import * as moment from 'moment';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [SpotifyService]
})
export class ListPage {
  items: Array<{title: string, note: string, icon: string}>;
  playLists: Array<{name: string, id: string, author: string, uri: string, tracks: any}>;
  alarms: Array<{name: string, date: any, playListName: any, id: number, dateInput: any, repeat: boolean}>;
  trigger: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storage: Storage,private _spotifyService: SpotifyService,
              private platform:Platform, public modalCtrl: ModalController,
              public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController,
              public localNotifications: LocalNotifications, public backgroundMode: BackgroundMode) { }

  private _spotifyModel = new SpotifyModel();
  public alarmId: number = 1;

  ngOnInit(){
    this.platform.ready().then(() => {
      this.storage.get('user').then((data) => {
        this._spotifyModel.setToken(data.accessToken);
        this._spotifyModel.setName(data.name);
        this.getPlayLists();
      });
    });
    this.alarms = [];
    this.storage.get('alarm').then((data) => {
      if(data){
        this.alarms = data;
      }
    });
    if(this.backgroundMode.isEnabled()) {
    }
    else {
      this.backgroundMode.enable();
      this.triggeredAlarm()
    }
  }
  getPlayLists() {
    this.playLists = [];
    this._spotifyService.getPlay(this._spotifyModel.accessToken).subscribe(
      res => {
        res['items'].forEach((x:any) => {
          this._spotifyService.getTracks(this._spotifyModel.accessToken, x.owner.id, x.id).subscribe(
            data => {
              this.playLists.push({
                name: x.name,
                id: x.id,
                author: x.owner.id,
                uri: x.uri,
                tracks: data,
              });
            }
          );
        })
      }
    );
  }
  public createAlarm(){
    for(let i = 0;i <= this.alarms.length; i++){
      if ((this.alarms[i] === undefined)) {
        this.alarmId = i;
        break;
      }
      else if(!(this.alarms[i].id === i)){
        this.alarmId = i;
        break;
      }
    }
    let modal = this.modalCtrl.create(ItemDetailsPage, {
      array: this.playLists,
      id: this.alarmId
    });
    modal.present();
    modal.onDidDismiss((data) => {
      if(data){
        this.alarms.push(data);
        this.storage.set('alarm', this.alarms);
      }
    });
  }
  triggeredAlarm() {
    let playListData;
    let track = new Audio();
    this.localNotifications.on("trigger", (notification) => {
      for (let i = 0; i < this.playLists.length; i++) {
        if (this.playLists[i].name === notification.data) {
          playListData = this.playLists[i].tracks;
        }
      }
      track.src = this.getRandomSong(playListData);
      track.load();
      track.play();
      let stop = this.alertCtrl.create({
        title: notification.title,
        buttons: [
          {
            text: 'Snooze',
            handler: () => {
              track.pause();
              this.localNotifications.clear(notification.id);
              this.postponeAlarm(notification);
            }
          },
          {
            text: 'Stop',
            handler: () => {
              track.pause();
              this.localNotifications.clearAll();
            }
          }
        ],
        enableBackdropDismiss: false
      });
      stop.present();
    });
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  getRandomSong(tracks) {
    let song: string;
    do {
      let i = this.getRandomInt(0, tracks.total);
      let y = 0;
      tracks['items'].forEach((x:any) => {
        if(y === i) {
          song = x.track.preview_url;
        }
        y++;
      })
    } while(song === null || song === undefined);
    return song;
  }
  presentActionSheet(alarm) {
    let actionSheet = this.actionSheetCtrl.create({
      title: alarm.name,
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.showConfirm(alarm);
          }
        },{
          text: 'Edit',
          icon: 'open',
          handler: () => {
            let modal = this.modalCtrl.create(ItemDetailsPage, {
              array: this.playLists,
              alarm: alarm,
              id: alarm.id
            });
            modal.present();
            modal.onDidDismiss((data) => {
              if(data){
                for(let i = 0; i < this.alarms.length; i++){
                  if(this.alarms[i].id === data.id) {
                    this.alarms[i] = data;
                    break;
                  }
                }
                this.storage.set('alarm', this.alarms);
              }
            });
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }
  public showConfirm(alarm) {
    let confirm = this.alertCtrl.create({
      title: 'Delete "'+ alarm.name + '"',
      message: 'Are you sure you want to delete it?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {}
        },
        {
          text: 'Delete',
          handler: () => {
            this.deletePlaylist(alarm.id);
          }
        }
      ]
    });
    confirm.present();
  }
  public deletePlaylist(id){
    this.localNotifications.cancel(id);
    for(let i = 0; i < this.alarms.length; i++) {
      if (this.alarms[i].id === id) {
        this.alarms.splice(i, 1);
        break;
      }
    }
    this.storage.set('alarm', this.alarms);
  }
  public deleteAlarms(){
    let confirm = this.alertCtrl.create({
      title: 'Delete All',
      message: 'Are you sure you want to delete all your alarms?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {}
        },
        {
          text: 'Delete',
          handler: () => {
            this.localNotifications.cancelAll();
            this.localNotifications.clearAll();
            this.alarms = [];
            this.storage.set('alarm', this.alarms);
          }
        }
      ]
    });
    confirm.present();
  }
  public postponeAlarm(notification) {
    this.localNotifications.schedule({
      id: 999,
      title: notification.title,
      at: new Date(new Date(moment().format('YYYY-MM-DDTHH:mm')).getTime() + 300000),
      sound: null,
      data: notification.data,
    });
  }
}
