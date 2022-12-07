import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DbService } from './services/db.service';
import { MenuController } from '@ionic/angular';

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
    private alertController: AlertController,
    ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navigate();
    });
    this.platform.ready().then(() => {
      //this.storage.create()
    });
  }
  devices : any []
  navigate(){
    this.router.navigate(['/tabs','home'])
  }
  ngOnInit(){
    this.getDevices();
  }
  hideMenu(){
    this.menu.close()
  }
  getDevices() {
    this.db.getDevices().then(_ => {
      this.devices = _
        if (this.devices.length == 0) {
          this.devices[0] = {
            name: "0 dispositivos"
          }
        }else{
          this.db.getDevice(_[0].id)
        }
    })
  }
  async showDeviceInformation(name, type, ip) {
    const alert = await this.alertController.create({
      header: name,
      message: '<ul><li><p>Tipo: <b>' + type + '</b></p></li></ul>'+
      '<ul><li><p>IP: <b>' + ip + '</b></p></li></ul>',
      buttons: ['OK'],
    });

    await alert.present();
  }
}