import { Component, NgZone } from '@angular/core';
import { HttpService } from '../services/http.service';
import { NavController, ToastController, AlertController, Platform } from '@ionic/angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { DbService } from '../services/db.service';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  name = "No device"
  ImAdmin = false;
  split: String = ""
  type: String = ""
  netname = ""
  SSID: String
  PASS: String
  BLEDEVS: any[] = []
  deviceBLE: any
  params = true
  sensors = true
  SSIDPASS = true
  NRegisters = 0
  devices: any[] = []
  deviceSelected
  ipDeviceSelected = "192.168.4.1"
  firstTime: Boolean = true
  generalPines = [1, 2, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 20, 25, 26, 27, 32, 33, 34, 35, 36, 39]
  relePines = [1, 2, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 20, 25, 26, 27, 32, 33, 34, 35, 36, 39]
  DHT11 = {
    id: 0,
    a: "Sensor inactivo",
    pines: {
      pin1: "0",
      pin2: "0",
      pin3: "0",
      pin4: "0"
    },
    temperatura: {
      pin_min: "0",
      pin_max: "0",
      ranges: {
        lower: 0,
        upper: 0
      },
      ideal: 0
    },
    humedad: {
      pin_min: "0",
      pin_max: "0",
      ranges: {
        lower: 0,
        upper: 0
      },
      ideal: 0
    }
  }
  DS18 = {
    id: 4,
    a: "Sensor inactivo",
    ranges: {
      lower: 0,
      upper: 0
    },
    ideal: 0,
    pines: {
      pin1: "0",
      pin2: "0",
      pin3: "0",
      pin4: "0",
      pin5: "0",
    },
    control_min_pin: "0",
    control_max_pin: "0"
  }
  Oxy = {
    id: 3,
    a: "Sensor inactivo",
    ranges: {
      lower: 0,
      upper: 0
    },
    ideal: 0,
    pines: {
      pin1: "0"
    },
    control_min_pin: "0",
    control_max_pin: "0"
  }
  YL = {
    id: 2,
    a: "Sensor inactivo",
    ranges: {
      lower: 0,
      upper: 0
    },
    ideal: 0,
    pines: {
      pin1: "0",
      pin2: "0",
      pin3: "0",
      pin4: "0",
      pin5: "0",
    },
    control_min_pin: "0",
    control_max_pin: "0"
  }
  disable = {
    loading: true,
    chDev: true,
    chDht: true,
    chDs18: true,
    chOxy: true,
    chYL: true,
    DHT: true,
    DS18: true,
    YL: true,
    Oxy: true,
    chCond: true
  }

  loading: Boolean = false
  showNotFound: Boolean = true
  showLoading: Boolean = true
  minutes = 0
  constructor(
    private db: DbService,
    private network: Network,
    private nav: NavController,
    private http: HttpService,
    private toastController: ToastController,
    private alertController: AlertController,
    public BLSE: BluetoothSerial,
    private ngZone: NgZone,
    public plt: Platform
  ) {
    this.plt.ready().then((readySource) => {
    });
  }
  ngOnInit() {
    this.scanDevices()
  }
  getDevices() {
    this.db.getDevices().then(_ => {
      this.devices = _
      if (this.firstTime) {
        if (this.devices.length == 0) {
          this.deviceSelected = "404"
        } else {
          this.deviceSelected = _[0].id
        }
        this.firstTime = false
      }
    })
  }
  changeDevice(dev) {
    this.deviceSelected = dev.target.value;
    //this.getDeviceData(this.deviceSelected)
    this.loadData()
  }
  changesDev() {
    if (!this.disable.loading) {
      this.disable.chDev = false;
    }
  }
  changesDHT() {
    if (!this.disable.loading) {
      this.disable.chDht = false;
      this.DHT11.a = Boolean(this.disable.DHT) ? "Sensor activo" : "Sensor inactivo"
    }
  }
  changesDs18() {
    if (!this.disable.loading) {
      this.disable.chDs18 = false;
      this.DS18.a = Boolean(this.disable.DS18) ? "Sensor activo" : "Sensor inactivo"
    }
  }
  changesOxy() {
    if (!this.disable.loading) {
      this.disable.chOxy = false;
      this.Oxy.a = Boolean(this.disable.Oxy) ? "Sensor activo" : "Sensor inactivo"
    }
  }
  changesYL() {
    if (!this.disable.loading) {
      this.disable.chYL = false;
      this.YL.a = Boolean(this.disable.YL) ? "Sensor activo" : "Sensor inactivo"
    }
  }
  ionViewWillEnter() {
    this.loadData()
  }
  loadData() {
    this.disable.loading = false;
    this.disable.chDev = true
    this.disable.chCond = true
    this.disable.chDht = true
    this.disable.chOxy = true
    this.disable.chDs18 = true
    this.disable.chYL = true
    this.sensors = true
    this.ImAdmin = true;
    this.loading = false
    this.showLoading = false
    this.showNotFound = true
    this.getDevices()
    //this.tryCheck()
    if (this.network.type == 'wifi') {
      if (this.deviceSelected == "404") {
        this.sensors = true;
        this.showLoading = true;
        this.showNotFound = true;
        this.SSIDPASS = false;
      } else {
        this.SSIDPASS = true;
        this.getDeviceData(this.deviceSelected)
      }
    } else {
      if (this.deviceSelected == "404") {
        this.SSIDPASS = false;
        this.showNotFound = true
        this.loading = true
        this.sensors = true
        this.showLoading = true
      } else {
        this.showNotFound = false
        this.SSIDPASS = true;
        this.loading = true
        this.sensors = true
        this.showLoading = true
      }
    }
  }
  plusNumber() {
    if (this.NRegisters < 60) {
      this.NRegisters = this.NRegisters + 1
    }
  }
  susNumber() {
    if (this.NRegisters > 5) {
      this.NRegisters = this.NRegisters - 1
    }
  }
  plusMin() {
    if (this.minutes < 60) {
      this.minutes = this.minutes + 1
    }
  }
  susMin() {
    if (this.minutes > 2) {
    this.minutes = this.minutes - 1
    }
  }
  tryCheck() {
    this.disable.loading = true;
    //this.http.presentLoadingWithOptions('Buscando dispositivo.').then()
    this.http.checkDeviceCM(this.ipDeviceSelected).subscribe((_) => {
      //console.log(_);
      this.params = false;
      this.SSID = _.ssid;
      this.PASS = _.password;
      this.name = _.name;
      this.NRegisters = _.NREG / 1
      this.minutes = _.time / 1000 / 60
      this.type = _.type;
      this.disable.chDev = true;
      //this.disable.loading = false;
      this.http.getSensors(this.ipDeviceSelected).subscribe((sensors) => {
        this.showNotFound = true
        this.showLoading = true
        if (sensors.DHT11 != undefined) {//Asignación de variables a DHT11
          const DHT = sensors.DHT11
          this.disable.DHT = DHT.active == "true" ? true : false
          this.DHT11.a = DHT.active == "true" ? "Sensor activo" : "Sensor inactivo"
          this.DHT11.id = DHT.id
          this.DHT11.pines.pin1 = String(DHT.read_pin).split(",")[0]
          this.DHT11.pines.pin2 = String(DHT.read_pin).split(",")[1]
          this.DHT11.pines.pin3 = String(DHT.read_pin).split(",")[2]
          this.DHT11.pines.pin4 = String(DHT.read_pin).split(",")[3]
          this.DHT11.temperatura.ideal = Number(String(DHT.ideal).split(",")[0])
          this.DHT11.humedad.ideal = Number(String(DHT.ideal).split(",")[1])
          this.DHT11.temperatura.ranges.lower = Number(String(DHT.min).split(",")[0])
          this.DHT11.humedad.ranges.lower = Number(String(DHT.min).split(",")[1])
          this.DHT11.temperatura.ranges.upper = Number(String(DHT.max).split(",")[0])
          this.DHT11.humedad.ranges.upper = Number(String(DHT.max).split(",")[1])
          this.DHT11.temperatura.pin_min = String(DHT.pin_min).split(",")[0]
          this.DHT11.humedad.pin_min = String(DHT.pin_min).split(",")[1]
          this.DHT11.temperatura.pin_max = String(DHT.pin_max).split(",")[0]
          this.DHT11.humedad.pin_max = String(DHT.pin_max).split(",")[1]
        }
        if (sensors.Ds18 != undefined) {//Asignación de variables a DHT11
          const DS18 = sensors.Ds18
          this.disable.DS18 = DS18.active == "true" ? true : false
          this.DS18.a = DS18.active == "true" ? "Sensor activo" : "Sensor inactivo"
          this.DS18.id = DS18.id
          this.DS18.pines.pin1 = String(DS18.read_pin)
          this.DS18.ideal = Number(String(DS18.ideal))
          this.DS18.ranges.lower = Number(String(DS18.min))
          this.DS18.ranges.upper = Number(String(DS18.max))
          this.DS18.control_min_pin = String(DS18.pin_min)
          this.DS18.control_max_pin = String(DS18.pin_max)
        }
        if (sensors.Oxygen != undefined) {//Asignación de variables a DHT11
          const Oxy = sensors.Oxygen
          this.disable.Oxy = Oxy.active == "true" ? true : false
          this.Oxy.a = Oxy.active == "true" ? "Sensor activo" : "Sensor inactivo"
          this.Oxy.id = Oxy.id
          this.Oxy.pines.pin1 = String(Oxy.read_pin)
          this.Oxy.ideal = Number(String(Oxy.ideal))
          this.Oxy.ranges.lower = Number(String(Oxy.min))
          this.Oxy.ranges.upper = Number(String(Oxy.max))
          this.Oxy.control_min_pin = String(Oxy.pin_min)
          this.Oxy.control_max_pin = String(Oxy.pin_max)
          console.log(Oxy);
        }
        if (sensors.YL != undefined) {//Asignación de variables a DHT11
          const YL = sensors.YL
          this.disable.YL = YL.active == "true" ? true : false
          this.YL.a = YL.active == "true" ? "Sensor activo" : "Sensor inactivo"
          this.YL.id = YL.id
          this.YL.pines.pin1 = String(YL.read_pin).split(",")[0]
          this.YL.pines.pin2 = String(YL.read_pin).split(",")[1]
          this.YL.pines.pin3 = String(YL.read_pin).split(",")[2]
          this.YL.pines.pin4 = String(YL.read_pin).split(",")[3]
          this.YL.ideal = Number(String(YL.ideal))
          this.YL.ranges.lower = Number(String(YL.min))
          this.YL.ranges.upper = Number(String(YL.max))
          this.YL.control_min_pin = String(YL.pin_min)
          this.YL.control_max_pin = String(YL.pin_max)
          console.log(YL);

        }
        this.sensors = false
        setTimeout(() => {
          this.disable.loading = false;
        }, 500);
      }, (error) => {
        this.showAlertNoDevice
      })
      this.http.dismissLoader()
      //this.http.presentLoadingWithOptions("Extrayendo datos del dispositivo")
    }, (error) => {
      //this.presentToast("Ha ocurriedo un error, vuelva a intentarlo.")
      this.http.dismissLoader()
      //this.showAlertNoDevice()
      this.showNotFound = false
      this.showLoading = true
      this.sensors = true
      this.loading = true
      console.log(error);
    })
  }
  refrescar(event) {
    this.loadData()
    setTimeout(() => {
      event.target.complete();
    }, 2500);
  }
  sendData() {
    let newData

    newData = "?newSSID=" + this.SSID.replace(" ", ",") + "&newPassword=" + this.PASS.replace(" ", ",")
      + "&newTime=" + this.minutes * 1000 * 60
      + "&newType=" + this.type
      + "&newName=" + this.name
      + "&newNR=" + this.NRegisters
    this.http.changeParams(this.ipDeviceSelected, newData).subscribe((_) => {
      this.presentToast("Parámetros enviados correctamente, el dispositivo se reiniciará.")
      this.db.updateTypeDevice(this.deviceSelected, this.name, this.type)
      this.loadData()
    }, (error) => {
      this.presentToast("Ha ocurriedo un error, vuelva a intentarlo.")
      this.http.dismissLoader()
      console.log(error);
    })
  }
  scanDevices() {
    this.BLEDEVS = []
    this.BLSE.list().then(d => {
      d.forEach(i => {
        this.BLEDEVS.push(i)
      });
    })
    //this.le.startScan().subscribe(dev => this.onDeviceDiscovered(dev))
  }
  onDeviceDiscovered(dev) {
    this.ngZone.run(() => {
      this.BLEDEVS.push(dev)
    })
  }
  onBleChanged(event) {
    console.log(event.target.value);
    this.BLSE.connect(this.deviceBLE).subscribe(state => {
      console.log(state);
    }, e => {
      console.log(e)
    })
  }
  sendSSIDPASS() {
    let data = this.SSID + "," + this.PASS
    this.BLSE.write(data).then(state => {
      console.log(state);
    }, e => {
      console.log(e)
    })

    /*if (this.ble.isConnected)
      console.log("WE ARE CURRENTLY CONNECTED");
    var string = "hola mundo bluetooth"

    var array = new Uint8Array(string.length);
    for (var x = 0, l = string.length; x < l; x++) { array[x] = string.charCodeAt(x); }

    this.ble.write(this.deviceBLE, "4fafc201-1fb5-459e-8fcc-c5c9c331914b".toLowerCase(),
      "beb5483e-36e1-4688-b7f5-ea07361b26a8".toLowerCase(), array)
      */
  }
  updateSensorDHT() {
    let newData
    newData = "?newUbiVar=temperatura,humedad"
      + "&newReadPin=" + this.DHT11.pines.pin1 + "," + this.DHT11.pines.pin2 + "," + this.DHT11.pines.pin3 + "," + this.DHT11.pines.pin4
      + "&newControlPinMin=" + this.DHT11.temperatura.pin_min + "," + this.DHT11.humedad.pin_min
      + "&newControlPinMax=" + this.DHT11.temperatura.pin_max + "," + this.DHT11.humedad.pin_max
      + "&newMin=" + this.DHT11.temperatura.ranges.lower + "," + this.DHT11.humedad.ranges.lower
      + "&newMax=" + this.DHT11.temperatura.ranges.upper + "," + this.DHT11.humedad.ranges.upper
      + "&newIdeal=" + this.DHT11.temperatura.ideal + "," + this.DHT11.humedad.ideal
      + "&active=" + this.disable.DHT
      + "&id=1"
    this.http.changeParamsSensor(this.ipDeviceSelected, newData).subscribe((_) => {
      this.presentToast("Parámetros enviados correctamente, el dispositivo se reiniciará.")
      setTimeout(() => {
        this.loadData()
      }, 500);
    }, (error) => {
      setTimeout(() => {
        this.loadData()
      }, 500);
      this.presentToast("Ha ocurriedo un error, vuelva a intentarlo.")
      this.http.dismissLoader()
      //console.log(error);
    })
  }
  updateSensorDS18() {
    let newData
    newData = "?newUbiVar=S_Temperatura"
      + "&newReadPin=" + this.DS18.pines.pin1
      + "&newControlPinMin=" + this.DS18.control_min_pin
      + "&newControlPinMax=" + this.DS18.control_max_pin
      + "&newMin=" + this.DS18.ranges.lower
      + "&newMax=" + this.DS18.ranges.upper
      + "&newIdeal=" + this.DS18.ideal
      + "&active=" + this.disable.DS18
      + "&id=4"
    this.http.changeParamsSensor(this.ipDeviceSelected, newData).subscribe((_) => {
      this.presentToast("Parámetros enviados correctamente, el dispositivo se reiniciará.")
      setTimeout(() => {
        this.loadData()
      }, 500);
    }, (error) => {
      setTimeout(() => {
        this.loadData()
      }, 500);
      this.presentToast("Ha ocurriedo un error, vuelva a intentarlo.")
      this.http.dismissLoader()
      //console.log(error);
    })
  }
  updateSensorOxy() {
    let newData
    newData = "?newUbiVar=Oxygen"
      + "&newReadPin=" + this.Oxy.pines.pin1
      + "&newControlPinMin=" + this.Oxy.control_min_pin
      + "&newControlPinMax=" + this.Oxy.control_max_pin
      + "&newMin=" + this.Oxy.ranges.lower
      + "&newMax=" + this.Oxy.ranges.upper
      + "&newIdeal=" + this.Oxy.ideal
      + "&active=" + this.disable.Oxy
      + "&id=3"
      console.log(newData);
      
    this.http.changeParamsSensor(this.ipDeviceSelected, newData).subscribe((_) => {
      this.presentToast("Parámetros enviados correctamente, el dispositivo se reiniciará.")
      setTimeout(() => {
        this.loadData()
      }, 500);
    }, (error) => {
      setTimeout(() => {
        this.loadData()
      }, 500);
      this.presentToast("Ha ocurriedo un error, vuelva a intentarlo.")
      this.http.dismissLoader()
      //console.log(error);
    })
  }
  updateSensorYL() {
    let newData
    newData = "?newUbiVar=S_Humedad"
      + "&newReadPin=" + this.YL.pines.pin1 + "," + this.YL.pines.pin2 + "," + this.YL.pines.pin3 + "," + this.YL.pines.pin4
      + "&newControlPinMin=" + this.YL.control_min_pin
      + "&newControlPinMax=" + this.YL.control_max_pin
      + "&newMin=" + this.YL.ranges.lower
      + "&newMax=" + this.YL.ranges.upper
      + "&newIdeal=" + this.YL.ideal
      + "&active=" + this.disable.YL
      + "&id=2"

    console.log(newData);
    this.http.changeParamsSensor(this.ipDeviceSelected, newData).subscribe((_) => {
      this.presentToast("Parámetros enviados correctamente, el dispositivo se reiniciará.")
      setTimeout(() => {
        this.loadData()
      }, 500);
    }, (error) => {
      setTimeout(() => {
        this.loadData()
      }, 500);
      this.presentToast("Ha ocurriedo un error, vuelva a intentarlo.")
      this.http.dismissLoader()
      //console.log(error);
    })
  }
  getDeviceData(id) {
    this.db.getDevice(id).then(_ => {
      this.ipDeviceSelected = _.ip
      console.log(this.ipDeviceSelected);
      this.tryCheck()
    })
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
  async showAlertParams(thing) {
    const alert = await this.alertController.create({
      header: "Adevertencia",
      message: "¿Estás seguro que deseas cambiar la configuración de " + this.name + "?",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => { //takes the data
            if (thing == 'DEV') {
              this.sendData()
            } else if (thing == 'DHT') {
              this.updateSensorDHT()
            } else if (thing == 'DS18') {
              this.updateSensorDS18()
            } else if (thing == 'Oxy') {
              this.updateSensorOxy()
            } else if (thing == 'YL') {
              this.updateSensorYL()
            }
          }
        }
      ]

    });

    await alert.present();
  }
  async showAlertHowFunction() {
    const alert = await this.alertController.create({
      header: "Información",
      subHeader: "¿Cómo funcionan los parámetros de los sensores?",
      message: "<ul>"
        + "<li><b>Rangos:</b> las gráficas cambian de color si el valor está fuera del rango</li>"
        + "<li><b>Mínimo:</b> activa el control automáticamente cuando el valor es inferior.</li>"
        + "<li><b>Máximo:</b> activa el control automáticamente cuando el valor es superior.</li>"
        + "<li><b>Ideal:</b> desactiva los controles cuando el valor llega a este número.</li>"
        + "</ul>",
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
        }
      ]

    });

    await alert.present();
  }
  async showAlertChangeStatus(sensor) {
    const alert = await this.alertController.create({
      header: "Adevertencia",
      message: "No tienes permisos para cambiar el estado del sensor, ingresa la contraseña para tener acceso:",
      inputs: [
        {
          placeholder: 'contraseña',
          type: 'password',
          name: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { //takes the data
            if (sensor == 'DHT') {
              this.disable.DHT = !this.disable.DHT
            } else if (sensor == 'Ds18') {
              this.disable.DS18 = !this.disable.DS18
            } else if (sensor == 'Oxy') {
              this.disable.Oxy = !this.disable.Oxy
            } else if (sensor == 'YL') {
              this.disable.YL = !this.disable.YL
            }
          }
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: (data) => { //takes the data
            if (data.password != "condor") {
              if (sensor == 'DHT') {
                this.disable.DHT = !this.disable.DHT
              } else if (sensor == 'Oxy') {
                this.disable.Oxy = !this.disable.Oxy
              } else if (sensor == 'Ds18') {
                this.disable.DS18 = !this.disable.DS18
              } else if (sensor == 'YL') {
                this.disable.YL = !this.disable.YL
              }
              this.presentToast("Contraseña no válida.")
            } else {
              this.presentToast("Estado del sensor: actualizado.")
            }
          }
        }
      ]

    });

    await alert.present();
  }
  async showAlertAreAdmin() {
    const alert = await this.alertController.create({
      header: "¿Admin?",
      message: "¿Eres administrador de Soatech? Bien, ingresa la contraseña:",
      inputs: [
        {
          placeholder: 'contraseña',
          type: 'password',
          name: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: (data) => { //takes the data
            if (data.password != "condor") {
              this.ImAdmin = false;
              this.presentToast("Contraseña no válida.")
            } else {
              this.ImAdmin = true;
              this.presentToast("Eres admin.")
            }
          }
        }
      ]

    });

    await alert.present();
  }
  async showAlertNoDevice() {
    const alert = await this.alertController.create({
      header: "Alto",
      subHeader: "Dispositivo no encontrado",
      message: "Cambie su dispositivo a <b> config_mode </b> y conéctese a su red, posteriormente regrese a este apartado.",
      buttons: [
        {
          text: 'ok',
          role: 'confirm',
        }
      ]

    });

    await alert.present();
    alert.onDidDismiss().then(() => {
      //this.nav.back()
      this.nav.navigateRoot("")
    });
  }
}
