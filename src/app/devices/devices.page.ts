import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { HttpService } from '../services/http.service';
import { AlertController, PopoverController } from '@ionic/angular';
import { NetworkInterface } from '@awesome-cordova-plugins/network-interface/ngx';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {
  ipNewDevice: String = ""
  devices: any[] = []
  conteo = 0;
  constructor(
    private networkInterface: NetworkInterface,
    private popoverController: PopoverController,
    public db: DbService,
    private http: HttpService,
    private alertController: AlertController
  ) { }
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getDevices()
  }
  async getDevices() {
    this.db.getDevices().then(_ => {
      this.devices = _
      if (this.devices.length == 0) {
        this.devices.push({
          name: "0 dispositivos, realiza un escaneo automático o añádelo manualmente."
        })
      }
    })
    await this.popoverController.dismiss();
  }

  checkDevice() {
    if (this.ipNewDevice != "") {
      this.db.verifyDevice(this.ipNewDevice).then(added => {
        if (added) {
          this.http.presentToast("Ya existe este dispositivo.")
        } else {
          this.http.presentLoadingWithOptions("Buscando dispositivos...")
          this.http.checkDevice(this.ipNewDevice).subscribe((response) => {
            this.db.addDevice(response.name, this.ipNewDevice, response.type)
            this.getDevices()
            this.http.dismissLoader()
          }, (error) => {
            this.http.dismissLoader()
            this.http.presentToast("La IP ingresada no es válida.")
            console.log(error);
          })
        }
      })
    } else {
      this.http.presentToast("Ingresa la IP del dispositivo.")
    }
  }

  deleteDevice(item: any) {
    this.db.deleteDevice(item.id, item.name);
    this.getDevices();
  }
  async showDeviceInformation(name, type, ip) {
    const alert = await this.alertController.create({
      header: name,
      message: '<ul><li><p>Tipo: <b>' + type + '</b></p></li></ul>'+
      '<ul><li><p>IP: <b>' + ip + '</b></p></li></ul>',
      buttons: ['OK'],
      cssClass: 'alert_success',
    });

    await alert.present();
  }
  GetIP(){
    this.networkInterface.getWiFiIPAddress()
    .then(address => {
      this.conteo = 0;
      console.log(address.ip);
      this.getAllIPs(address.ip)
    })
    .catch(error => console.error(`Unable to get IP: ${error}`));
  }
  getAllIPs(IP: String){
    this.http.presentLoadingWithOptions("Buscando dispositivos...")
    let directionArray = IP.split(".")
    const direction = directionArray[0] + "." + directionArray[1] + "." + directionArray[2] + ".";
    this.db.emptyDB()
    for (let index = 1; index < 254; index++) {
      let temporalIP = direction + "" + index;
      this.tryConnectTo(temporalIP)
      //this.tryConnectTo(temporalIP+ ":8080/api")
    }
    setTimeout(() => {
      this.http.dismissLoader()
      if(this.conteo > 0){
        this.ShowResults();
      }else{
        this.No_Results();
      }
    }, 10000)
  }
  tryConnectTo(IP){
    try{
      this.http.checkDeviceCM(IP).subscribe(_ => {
        this.conteo ++
        this.db.addDevice(_.name, IP, _.type)
      });
    }catch {
      
    }
  }
  async Ask_FindDevices() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: "¿Está seguro que desea actualizar el listado de dispositivos?",
      buttons: [
        {
          text: 'Atrás',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          },
        },
        {
          text: 'Actualizar',
          role: 'confirm',
          handler: () => {
              this.GetIP()
              //this.descargarArchivo
          },
        },
      ],
      cssClass: 'alert_success',
    });

    await alert.present();
  }
  async ShowResults() {
    this.getDevices();
    const alert = await this.alertController.create({
      header: 'Búsqueda finalizada',
      message: "No. de dispositivos: <b>" + this.conteo + "</b>",
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {

          },
        }
      ],
      cssClass: 'alert_success',
    });

    await alert.present();
  }
  async No_Results() {
    const alert = await this.alertController.create({
      header: 'Búsqueda finalizada',
      subHeader: "No pudimos encontrar tus dispositivos, posibles cusas:",
      message:"<ul>"+
                "<li>No estás conectado a misma red.</li>"+
                "<li>Los dispositivos no están conectados a la red.</li>"+
                "<li>Intenta desconectar/conectar los dispositivos.</li>"+
                "<li>Apaga tus datos móviles.</li>"+
              "</ul>",
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {

          },
        }
      ],
      cssClass: 'alert_success',
    });

    await alert.present();
  }
}
