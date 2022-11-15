import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DownloadsService } from './services/downloads.service';
import { HttpService } from './services/http.service';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { NetworkInterface } from '@awesome-cordova-plugins/network-interface/ngx';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { BluetoothLE } from '@awesome-cordova-plugins/bluetooth-le/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileTransfer, 
    File, 
    FileOpener,
    NetworkInterface,
    BluetoothSerial,
    BluetoothLE,
    //LocalNotifications,
    InAppBrowser, 
    DownloadsService, 
    HttpService, 
    Network,
    SQLite],
  bootstrap: [AppComponent],
})
export class AppModule {}
