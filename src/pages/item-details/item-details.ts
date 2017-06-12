import { Component } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';


@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  selectedItem: any;
  playLists: Array<{name: string, id: string, author: string, uri: string, tracks: any}>;
  myName: any;
  myDate = moment().format();
  playSelect: any;
  id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public localNotifications: LocalNotifications) { }

  ngOnInit() {
    this.playLists = this.navParams.get('array');
  }
  public closeAlarm(){
    this.navCtrl.pop();
  }
  public saveAlarm(){
    let alarm = {
      name: this.myName,
      date: moment(this.myDate).format('hh:mm a'),
      playListName: this.playSelect,
      id: this.navParams.get('id'),
      dateInput: this.myDate
    };
    let alarmDate = moment(this.myDate);
    let playListData;
    let track;
    for (let i = 0; i < this.playLists.length; i++) {
      if (this.playLists[i].name === alarm.playListName) {
        playListData = this.playLists[i].tracks;
      }
    }
    track = this.getRandomSong(playListData);
    this.localNotifications.schedule({
      id: alarm.id,
      title: alarm.name,
      at: new Date(new Date(alarmDate.format('YYYY-MM-DDTHH:mm')).getTime()),
      sound: track,
      data: alarm.playListName,
    });
    this.viewCtrl.dismiss(alarm);
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
    } while(song === null);
    return song;
  }
}
