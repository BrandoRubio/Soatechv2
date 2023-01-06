import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LoadingController } from '@ionic/angular';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  //urlSite = 'https://industrial.ubidots.com/app/dashboards/'
  urlSite = 'https://space2021.iot.ubidots.com/app/dashboards/'
  options: InAppBrowserOptions = {
    location: 'yes',
    hidenavigationbuttons: 'yes',
    hideurlbar: 'yes',
    fullscreen: 'no',
    toolbarcolor: '#01a3d2',
  }
  logo = "logotipo.png"
  constructor(
    private db: DbService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private iab: InAppBrowser) {
  }

  ngOnInit() {
    //this.loadUbiWebSite()
  }

  loadUbiWebSite() {
    this.options.toolbarcolor = document.documentElement.style.getPropertyValue('--ion-color-primary')
    if(this.options.toolbarcolor == ""){
      this.options.toolbarcolor = '#01a3d2'
    }
    this.iab.create(this.urlSite, '_blank', this.options)
  }

  openInExternal() {
    window.open(this.urlSite, '_system');
  }

  ionViewWillEnter() {
    try {
      this.logo = this.db.getLogo()
    } catch (error) {
      console.log(error);
    }
  }
}
