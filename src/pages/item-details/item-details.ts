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
  repeat: boolean;
  alarmDate: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public localNotifications: LocalNotifications) { }

  ngOnInit() {
    this.playLists = this.navParams.get('array');
    if(this.navParams.get('alarm')) {
      let alarm = this.navParams.get('alarm');
      this.myName = alarm.name;
      this.myDate = alarm.dateInput;
      this.playSelect = alarm.playListName;
      this.repeat = alarm.repeat
    }
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
      dateInput: this.myDate,
      repeat: this.repeat
    };
    this.verifyDate(alarm.dateInput);
    let repeatEvery: string;
    if(this.repeat){
      repeatEvery = "day";
    }

    this.localNotifications.schedule({
      id: alarm.id,
      title: alarm.name,
      firstAt: new Date(new Date(this.alarmDate.format('YYYY-MM-DDTHH:mm')).getTime()),
      sound: null,
      data: alarm.playListName,
      every: repeatEvery
    });
    this.viewCtrl.dismiss(alarm);
  }
  public verifyDate(date) {
    if(moment().format() > date) {
      this.alarmDate = moment(date).add(1, 'd');
    }
    else {
      this.alarmDate = moment(date);
    }
  }
}
