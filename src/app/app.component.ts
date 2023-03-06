import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DbService } from './services/db.service';
import { MenuController } from '@ionic/angular';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx'
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { NotificationsService } from './services/notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router,
    private db: DbService,
    private menu: MenuController,
    private notifications: NotificationsService,
    private backgroundMode: BackgroundMode,
    private alertController: AlertController,
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navigate();
    });
    this.backgroundMode.enable();
  }
  devices: any[]
  navigate() {
    this.router.navigate(['/tabs', 'home'])
  }
  ngOnInit() {
    this.platform.ready().then(() => {
      this.getDevices();
      this.notifications.listeners()
    });
    // PushNotifications.
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        //console.log('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        //console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }
  hideMenu() {
    this.menu.close()
  }
  getDevices() {
    this.db.getDevices().then(_ => {
      this.devices = _
      if (this.devices.length == 0) {
        this.devices[0] = {
          name: "0 dispositivos"
        }
      } else {
        this.db.getDevice(_[0].id)
      }
    })
  }
  async showDeviceInformation(name, type, ip) {
    const alert = await this.alertController.create({
      header: name,
      message: '<ul><li><p>Tipo: <b>' + type + '</b></p></li></ul>' +
        '<ul><li><p>IP: <b>' + ip + '</b></p></li></ul>',
      buttons: ['OK'],
      cssClass: 'alert_success',
    });

    await alert.present();
  }
}