import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DbService {

  devicesList: any[] = [];
  logo = "logotipo.png"
  private storage: SQLiteObject;
  constructor(
    public toastController: ToastController,
    private platform: Platform,
    private sqlite: SQLite,) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'devices.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db
          db.executeSql('CREATE TABLE IF NOT EXISTS devices ('
            + 'id INTEGER PRIMARY KEY,'
            + 'name VARCHAR(25),'
            + 'type VARCHAR(25),'
            + 'ip VARCHAR(20)'
            + ')', [])
            .then(() => console.log('Executed SQL'))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    });
  }

  async getDevices() {
    //this.presentToast(JSON.stringify(/*this.devicesList))
    await this.storage.executeSql('SELECT * FROM devices', []).then(res => {
      let items: any[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            name: res.rows.item(i).name,
            ip: res.rows.item(i).ip,
            type: res.rows.item(i).type,
            num: i + 1 + ".-",
            //color: res.rows.item(i).color,
          });
        }
      }
      this.devicesList = items;
      //return items
      //this.presentToast(JSON.stringify(items))
    })
    //console.log(this.devicesList)
    return this.devicesList
  }

  fetchDevices() {
    return this.devicesList;
  }

  addDevice(name, ip, type) {
    let data = [name, ip, type];
    return this.storage.executeSql('INSERT INTO devices (name, ip, type) VALUES (?, ?, ?)', data)
      .then(res => {
        this.presentToast("Dispositivo agregado.")
        this.getDevices()
      });
  }
  //Get 1 Device
  getDevice(id): Promise<any> {
    return this.storage.executeSql('SELECT * FROM devices WHERE id = ?', [id]).then(res => {
      if (res.rows.item(0).type == "insectos") {
        this.logo = "logo grillos.png"
        document.documentElement.style.setProperty('--ion-color-primary', '#a34f00');
        document.documentElement.style.setProperty('--ion-color-primary-rgb', '163,79,0');
        document.documentElement.style.setProperty('--ion-color-primary-contrast', '#ffffff');
        document.documentElement.style.setProperty('--ion-color-primary-contrast-rgb', '255,255,255');
        document.documentElement.style.setProperty('--ion-color-primary-shade', '#8f4600');
        document.documentElement.style.setProperty('--ion-color-primary-tint', '#ac611a');
      } else
        if (res.rows.item(0).type == "acuicola") {
          this.logo = "logo acuaponia.png"
          document.documentElement.style.setProperty('--ion-color-primary', '#3f79ee');
          document.documentElement.style.setProperty('--ion-color-primary-rgb', '63,121,238');
          document.documentElement.style.setProperty('--ion-color-primary-contrast', '#ffffff');
          document.documentElement.style.setProperty('--ion-color-primary-contrast-rgb', '255,255,255');
          document.documentElement.style.setProperty('--ion-color-primary-shade', '#376ad1');
          document.documentElement.style.setProperty('--ion-color-primary-tint', '#5286f0');
        } else
          if (res.rows.item(0).type == "floral") {
            this.logo = "logo floral.png"
            document.documentElement.style.setProperty('--ion-color-primary', '#6fb563');
            document.documentElement.style.setProperty('--ion-color-primary-rgb', '111,181,99');
            document.documentElement.style.setProperty('--ion-color-primary-contrast', '#ffffff');
            document.documentElement.style.setProperty('--ion-color-primary-contrast-rgb', '255,255,255');
            document.documentElement.style.setProperty('--ion-color-primary-shade', '#629f57');
            document.documentElement.style.setProperty('--ion-color-primary-tint', '#7dbc73');
          } else
            if (res.rows.item(0).type == "ganadero") {
              this.logo = "logo ganadero.png"
              document.documentElement.style.setProperty('--ion-color-primary', '#ff5757');
              document.documentElement.style.setProperty('--ion-color-primary-rgb', '255,87,87');
              document.documentElement.style.setProperty('--ion-color-primary-contrast', '#ffffff');
              document.documentElement.style.setProperty('--ion-color-primary-contrast-rgb', '255,255,255');
              document.documentElement.style.setProperty('--ion-color-primary-shade', '#e04d4d');
              document.documentElement.style.setProperty('--ion-color-primary-tint', '#ff6868');
            } else
              if (res.rows.item(0).type == "avicola") {
                this.logo = "logo avicola.png"
                document.documentElement.style.setProperty('--ion-color-primary', '#E3C501');
                document.documentElement.style.setProperty('--ion-color-primary-rgb', '227,197,1');
                document.documentElement.style.setProperty('--ion-color-primary-contrast', '#ffffff');
                document.documentElement.style.setProperty('--ion-color-primary-contrast-rgb', '255,255,255');
                document.documentElement.style.setProperty('--ion-color-primary-shade', '#c8ad01');
                document.documentElement.style.setProperty('--ion-color-primary-tint', '#e6cb1a');
              } else
                if (res.rows.item(0).type == "integral") {
                  this.logo = "logotipo.png"
                  document.documentElement.style.setProperty('--ion-color-primary', '#01a3d2');
                  document.documentElement.style.setProperty('--ion-color-primary-rgb', '56, 128, 255');
                  document.documentElement.style.setProperty('--ion-color-primary-contrast', '#ffffff');
                  document.documentElement.style.setProperty('--ion-color-primary-contrast-rgb', '255,255,255');
                  document.documentElement.style.setProperty('--ion-color-primary-shade', '#3171e0');
                  document.documentElement.style.setProperty('--ion-color-primary-tint', '#4c8dff');
                } else {
                  this.logo = "logotipo.png"
                  document.documentElement.style.setProperty('--ion-color-primary', '#01a3d2');
                  document.documentElement.style.setProperty('--ion-color-primary-rgb', '56, 128, 255');
                  document.documentElement.style.setProperty('--ion-color-primary-contrast', '#ffffff');
                  document.documentElement.style.setProperty('--ion-color-primary-contrast-rgb', '255,255,255');
                  document.documentElement.style.setProperty('--ion-color-primary-shade', '#3171e0');
                  document.documentElement.style.setProperty('--ion-color-primary-tint', '#4c8dff');
                }
      return {
        id: res.rows.item(0).id,
        name: res.rows.item(0).name,
        ip: res.rows.item(0).ip,
        type: res.rows.item(0).type
      }
    });
  }
  getLogo(): string {
    return this.logo
  }
  //Verificar si existe el dispositivo
  verifyDevice(ip): Promise<any> {
    return this.storage.executeSql('SELECT * FROM devices WHERE ip = ?', [ip]).then(res => {
      if (res.rows.length == 0) {
        return false
      } else {
        return true
      }
    })
  }
  // Update
  updateDevice(id, name, ip) {
    let data = [id, name, ip];
    return this.storage.executeSql(`UPDATE devices SET name = ?, ip = ? WHERE id = ${id}`, data)
      .then(data => {
        this.getDevices();
      })
  }
  // UpdateType
  updateTypeDevice(id, name, type) {
    let data = [name, type];
    return this.storage.executeSql(`UPDATE devices SET name = ?, type = ? WHERE id = ${id}`, data)
      .then(data => {
        this.getDevices();
      })
  }

  // Delete
  async deleteDevice(id, name) {
    return this.storage.executeSql('DELETE FROM devices WHERE id = ?', [id])
      .then(_ => {
        this.presentToast("Has eliminado el dispositivo " + name);
        //this.setDevice("", "")
        this.getDevices();
      });
  }
  // Delete
  async emptyDB() {
    return this.storage.executeSql('DELETE FROM devices;')
      .then(_ => {
        //this.presentToast("Has eliminado el dispositivo " + name);
        //this.setDevice("", "")
        this.getDevices();
      });
  }

  /*dbState() {
    return this.isDbReady.asObservable();
  }*/

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  /*
  async setDevice(name, ipD) {
    await Storage.set({
      key: 'device',
      value: JSON.stringify({
        name: name,
        ip: ipD
      })
    });
  }*/
}
