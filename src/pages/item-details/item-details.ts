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
    for (let i = 0; i < this.playLists.length; i++) {
      if (this.playLists[i].name === alarm.playListName) {
        playListData = this.playLists[i].tracks;
      }
    }
    this.localNotifications.schedule({
      id: alarm.id,
      title: alarm.name,
      at: new Date(new Date(alarmDate.format('YYYY-MM-DDTHH:mm')).getTime()),
      sound: null,
      data: alarm.playListName,
    });
    this.viewCtrl.dismiss(alarm);
  }
}
