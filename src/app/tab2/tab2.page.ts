import { Component } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { DbService } from '../services/db.service';
import { NetworkInterface } from '@awesome-cordova-plugins/network-interface/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  constructor(
    private networkInterface: NetworkInterface,
    private db: DbService,
    private network: Network,
    private nav: NavController,
    private http: HttpService,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {
    /*this.plt.ready().then((readySource) => {
    });*/
  }
  name = "No device"
  id = ""
  ImAdmin = false;
  split: String = ""
  type: String = ""
  netname = ""
  myIP = ""
  SSID: String
  PASS: String
  BLEDEVS: any[] = []
  deviceBLE: any
  params = true
  sensors = true
  SSIDPASS = true
  NRegisters = 0
  devices: any[] = []
  deviceSelected = "404"
  externalDevice = "Dispositivo Externo"
  ipDeviceSelected = "192.168.4.1"
  firstTime: Boolean = true
  ft: Boolean = true
  loading: Boolean = false
  showNotFound: Boolean = true
  showLoading: Boolean = true
  minutes = 0
  DHTPines = [2, 4, 5, 13, 14, 15, 16, 17, 18, 19, 22, 23, 25, 27, 32, 33, 34, 35, 36, 37, 38, 39]
  generalPines = [1, 2, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 20, 25, 26, 27, 32, 33, 34, 35, 36, 39]
  relePines = [2, 4, 12, 13, 14, 15, 16, 17, 20, 25, 26, 27, 32, 33]
  DHT11 = {
    id: 0,
    a: "Sensor inactivo",
    pines: {
      pin1: "0",
      pin2: "0",
      pin3: "0",
      pin4: "0",
      pin5: "0",
      pin6: "0",
      pin7: "0",
    },
    temperatura: {
      pin_min: "0",
      pin_max: "0",
      pin_fan: "0",
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
  Cond = {
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
  PH = {
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
  CO2 = {
    id: 7,
    a: "Sensor inactivo",
    ranges: {
      lower: 0,
      upper: 0
    },
    ideal: 0,
    pines: {
      pin1: "0",
    },
    control_min_pin: "0",
    control_max_pin: "0"
  }
  JSN = {
    id: 9,
    a: "Sensor inactivo",
    ranges: {
      lower: 0,
      upper: 0
    },
    ideal: 0,
    pines: {
      pin1: "0",
      pin2: "0",
    },
    control_min_pin: "0",
    control_max_pin: "0"
  }
  LUM = {
    id: 8,
    a: "Sensor inactivo",
    ranges: {
      lower: 0,
      upper: 0
    },
    ideal: 0,
    control_min_pin: "0",
    control_max_pin: "0"
  }
  disable = {
    loading: true,
    chDev: true,
    chDht: true,
    chDs18: true,
    chOxy: true,
    chPH: true,
    chCond: true,
    chYL: true,
    chCO2: true,
    chJSN: true,
    chLUM: true,
    DHT: true,
    DS18: true,
    YL: true,
    CO2: true,
    JSN: true,
    LUM: true,
    Oxy: true,
    PH: true,
    Cond: true,
  }
  show = {
    DHT: false,
    DS18: false,
    YL: false,
    CO2: false,
    JSN: false,
    LUM: false,
    Oxy: false,
    PH: false,
    Cond: false,
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
  changesPH() {
    if (!this.disable.loading) {
      this.disable.chPH = false;
      this.PH.a = Boolean(this.disable.PH) ? "Sensor activo" : "Sensor inactivo"
    }
  }
  changesCond() {
    if (!this.disable.loading) {
      this.disable.chCond = false;
      this.Cond.a = Boolean(this.disable.Cond) ? "Sensor activo" : "Sensor inactivo"
    }
  }
  changesYL() {
    if (!this.disable.loading) {
      this.disable.chYL = false;
      this.YL.a = Boolean(this.disable.YL) ? "Sensor activo" : "Sensor inactivo"
    }
  }
  changesCO2() {
    if (!this.disable.loading) {
      this.disable.chCO2 = false;
      this.CO2.a = Boolean(this.disable.CO2) ? "Sensor activo" : "Sensor inactivo"
    }
  }
  changesJSN() {
    if (!this.disable.loading) {
      this.disable.chJSN = false;
      this.JSN.a = Boolean(this.disable.JSN) ? "Sensor activo" : "Sensor inactivo"
    }
  }
  changesLUM() {
    if (!this.disable.loading) {
      this.disable.chLUM = false;
      this.LUM.a = Boolean(this.disable.LUM) ? "Sensor activo" : "Sensor inactivo"
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
    this.disable.chPH = true
    this.disable.chDs18 = true
    this.disable.chYL = true
    this.disable.chLUM = true
    this.disable.chCO2 = true
    this.disable.chJSN = true
    this.sensors = true
    this.ImAdmin = false;
    this.loading = false
    this.showLoading = false
    this.showNotFound = true
    this.getDevices()
    //this.tryCheck()
    if (this.network.type == 'wifi') {
      
      this.GetIP()
      if (this.ft) {
        console.log("ft");
        
        this.ft = false
      } else {
        console.log("st");
      }
      /*if (this.deviceSelected == "404") {
        this.sensors = true;
        this.showLoading = true;
        this.showNotFound = true;
        this.SSIDPASS = false;
      } else {*/
      this.SSIDPASS = true;
      this.getDeviceData(this.deviceSelected)
      //}
    } else {
      /*if (this.deviceSelected == "404") {
        this.SSIDPASS = false;
        this.showNotFound = true
        this.loading = true
        this.sensors = true
        this.showLoading = true
      } else {*/
      this.showNotFound = false
      this.SSIDPASS = true;
      this.loading = true
      this.sensors = true
      this.showLoading = true
      //}
    }
  }
  GetIP() {
    this.networkInterface.getWiFiIPAddress()
      .then(address => {
        //console.log(address.ip);
        this.myIP = address.ip
      })
      .catch(error => console.error(`Unable to get IP: ${error}`));
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
    //this.showNotFound = false
    this.disable.loading = true;
    //this.http.presentLoadingWithOptions('Buscando dispositivo.').then()
    this.http.checkDeviceCM(this.ipDeviceSelected).subscribe((_) => {
      console.log("Check");
      this.params = false;
      this.id = _.id;
      this.SSID = _.ssid;
      this.PASS = _.password;
      this.name = _.name;
      this.NRegisters = _.NREG / 1
      this.minutes = _.time / 1000 / 60
      this.type = _.type;
      this.disable.chDev = true;
      //this.disable.loading = false;
      console.log(this.ipDeviceSelected);
      this.http.getSensors(this.ipDeviceSelected).subscribe((sensors) => {
        console.log("Sensors");
        this.showNotFound = true
        this.showLoading = true
        if (sensors.DHT11 != undefined) {//Asignación de variables a DHT11
          const DHT = sensors.DHT11
          this.disable.DHT = DHT.active == "true" ? true : false
          if (_.type == "insectos" || _.type == "integral" || this.ImAdmin || this.disable.DHT) {
            this.show.DHT = false;
          } else {
            this.show.DHT = true;
          }
          this.disable.DHT = DHT.active == "true" ? true : false
          this.DHT11.a = DHT.active == "true" ? "Sensor activo" : "Sensor inactivo"
          this.DHT11.id = DHT.id
          this.DHT11.pines.pin1 = String(DHT.read_pin).split(",")[0]
          this.DHT11.pines.pin2 = String(DHT.read_pin).split(",")[1]
          this.DHT11.pines.pin3 = String(DHT.read_pin).split(",")[2]
          this.DHT11.pines.pin4 = String(DHT.read_pin).split(",")[3]
          this.DHT11.pines.pin5 = String(DHT.read_pin).split(",")[4]
          this.DHT11.pines.pin6 = String(DHT.read_pin).split(",")[5]
          this.DHT11.pines.pin7 = String(DHT.read_pin).split(",")[6]
          this.DHT11.temperatura.ideal = Number(String(DHT.ideal).split(",")[0])
          this.DHT11.humedad.ideal = Number(String(DHT.ideal).split(",")[1])
          this.DHT11.temperatura.ranges.lower = Number(String(DHT.min).split(",")[0])
          this.DHT11.humedad.ranges.lower = Number(String(DHT.min).split(",")[1])
          this.DHT11.temperatura.ranges.upper = Number(String(DHT.max).split(",")[0])
          this.DHT11.humedad.ranges.upper = Number(String(DHT.max).split(",")[1])
          this.DHT11.temperatura.pin_min = String(DHT.pin_min).split(",")[0]
          this.DHT11.humedad.pin_min = String(DHT.pin_min).split(",")[1]
          this.DHT11.temperatura.pin_fan = String(DHT.pin_min).split(",")[2]
          this.DHT11.temperatura.pin_max = String(DHT.pin_max).split(",")[0]
          this.DHT11.humedad.pin_max = String(DHT.pin_max).split(",")[1]
        }
        if (sensors.Ds18 != undefined) {//Asignación de variables a DHT11
          const DS18 = sensors.Ds18
          this.disable.DS18 = DS18.active == "true" ? true : false
          if (_.type == "insectos" || _.type == "integral" || this.ImAdmin || this.disable.DS18) {
            this.show.DS18 = false;
          } else {
            this.show.DS18 = true;
          }
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
          if (_.type == "acuicola" || _.type == "integral" || this.ImAdmin || this.disable.Oxy) {
            this.show.Oxy = false;
          } else {
            this.show.Oxy = true;
          }
          this.disable.Oxy = Oxy.active == "true" ? true : false
          this.Oxy.a = Oxy.active == "true" ? "Sensor activo" : "Sensor inactivo"
          this.Oxy.id = Oxy.id
          this.Oxy.pines.pin1 = String(Oxy.read_pin)
          this.Oxy.ideal = Number(String(Oxy.ideal))
          this.Oxy.ranges.lower = Number(String(Oxy.min))
          this.Oxy.ranges.upper = Number(String(Oxy.max))
          this.Oxy.control_min_pin = String(Oxy.pin_min)
          this.Oxy.control_max_pin = String(Oxy.pin_max)
        }
        if (sensors.Conductividad != undefined) {//Asignación de variables a DHT11
          const Cond = sensors.Conductividad
          this.disable.Cond = Cond.active == "true" ? true : false
          if (_.type == "acuicola" || _.type == "integral" || this.ImAdmin || this.disable.Cond) {
            this.show.Cond = false;
          } else {
            this.show.Cond = true;
          }
          this.Cond.a = Cond.active == "true" ? "Sensor activo" : "Sensor inactivo"
          this.Cond.id = Cond.id
          this.Cond.pines.pin1 = String(Cond.read_pin)
          this.Cond.ideal = Number(String(Cond.ideal))
          this.Cond.ranges.lower = Number(String(Cond.min))
          this.Cond.ranges.upper = Number(String(Cond.max))
          this.Cond.control_min_pin = String(Cond.pin_min)
          this.Cond.control_max_pin = String(Cond.pin_max)
        }
        if (sensors.PH != undefined) {//Asignación de variables a DHT11
          const PH = sensors.PH
          this.disable.PH = PH.active == "true" ? true : false
          if (_.type == "acuicola" || _.type == "integral" || this.ImAdmin || this.disable.PH) {
            this.show.PH = false;
          } else {
            this.show.PH = true;
          }
          this.disable.PH = PH.active == "true" ? true : false
          this.PH.a = PH.active == "true" ? "Sensor activo" : "Sensor inactivo"
          this.PH.id = PH.id
          this.PH.pines.pin1 = String(PH.read_pin)
          this.PH.ideal = Number(String(PH.ideal))
          this.PH.ranges.lower = Number(String(PH.min))
          this.PH.ranges.upper = Number(String(PH.max))
          this.PH.control_min_pin = String(PH.pin_min)
          this.PH.control_max_pin = String(PH.pin_max)
        }
        if (sensors.YL != undefined) {//Asignación de variables a DHT11
          const YL = sensors.YL
          this.disable.YL = YL.active == "true" ? true : false
          if (_.type == "insectos" || _.type == "integral" || this.ImAdmin || this.disable.YL) {
            this.show.YL = false;
          } else {
            this.show.YL = true;
          }
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
        }
        if (sensors.CO2 != undefined) {//Asignación de variables a Co2
          const CO2 = sensors.CO2
          this.disable.CO2 = CO2.active == "true" ? true : false
          if (_.type == "insectos" || _.type == "integral" || this.ImAdmin || this.disable.CO2) {
            this.show.CO2 = false;
          } else {
            this.show.CO2 = true;
          }
          this.CO2.a = CO2.active == "true" ? "Sensor activo" : "Sensor inactivo"
          this.CO2.id = CO2.id
          this.CO2.pines.pin1 = String(CO2.read_pin)
          this.CO2.ideal = Number(String(CO2.ideal))
          this.CO2.ranges.lower = Number(String(CO2.min))
          this.CO2.ranges.upper = Number(String(CO2.max))
          this.CO2.control_min_pin = String(CO2.pin_min)
          this.CO2.control_max_pin = String(CO2.pin_max)
        }
        if (sensors.JSN != undefined) {//Asignación de variables a JSN
          const JSN = sensors.JSN
          this.disable.JSN = JSN.active == "true" ? true : false
          if (_.type == "insectos" || _.type == "integral" || this.ImAdmin || this.disable.JSN) {
            this.show.JSN = false;
          } else {
            this.show.JSN = true;
          }
          this.JSN.a = JSN.active == "true" ? "Sensor activo" : "Sensor inactivo"
          this.JSN.id = JSN.id
          this.JSN.pines.pin1 = String(JSN.read_pin).split(",")[0]
          this.JSN.pines.pin2 = String(JSN.read_pin).split(",")[1]
          this.JSN.ideal = Number(String(JSN.ideal))
          this.JSN.ranges.lower = Number(String(JSN.min))
          this.JSN.ranges.upper = Number(String(JSN.max))
          this.JSN.control_min_pin = String(JSN.pin_min)
          this.JSN.control_max_pin = String(JSN.pin_max)
        }
        if (sensors.Luminosidad != undefined) {//Asignación de variables a DHT11
          const LUM = sensors.Luminosidad
          this.disable.LUM = LUM.active == "true" ? true : false
          if (_.type == "insectos" || _.type == "integral" || _.type == "agricola" || this.ImAdmin || this.disable.LUM) {
            this.show.LUM = false;
          } else {
            this.show.LUM = true;
          }
          this.LUM.a = LUM.active == "true" ? "Sensor activo" : "Sensor inactivo"
          this.LUM.id = LUM.id
          this.LUM.ideal = Number(String(LUM.ideal))
          this.LUM.ranges.lower = Number(String(LUM.min))
          this.LUM.ranges.upper = Number(String(LUM.max))
          this.LUM.control_min_pin = String(LUM.pin_min)
          this.LUM.control_max_pin = String(LUM.pin_max)
        }
        this.sensors = false
        setTimeout(() => {
          this.disable.loading = false;
        }, 500);
      }, (error) => {
        console.log("ERR");
        console.log(error);
        this.showAlertNoDevice()
        this.showNotFound = false
        this.showLoading = true
        this.sensors = true
        this.loading = true
      })
      this.http.dismissLoader()
      //this.http.presentLoadingWithOptions("Extrayendo datos del dispositivo")
    }, (error) => {
      //this.presentToast("Ha ocurriedo un error, vuelva a intentarlo.")
      console.log("ERRORRS");
      console.log(error);
      this.http.dismissLoader()
      //this.showAlertNoDevice()
      this.showNotFound = false
      this.showLoading = true
      this.sensors = true
      this.loading = true
    })
  }
  refrescar(event) {
    this.loadData()
    setTimeout(() => {
      event.target.complete();
    }, 2500);
  }
  sendData() {
    let newData = "?newSSID=" + this.SSID.replace(" ", ",") + "&newPassword=" + this.PASS.replace(" ", ",")
      + "&newTime=" + this.minutes * 1000 * 60
      + "&newType=" + this.type
      + "&newName=" + this.name
      + "&newNR=" + this.NRegisters
      + "&ip=" + this.myIP
    this.http.changeParams(this.ipDeviceSelected, newData).subscribe((_) => {
      this.presentToast("Parámetros enviados correctamente, el dispositivo se reiniciará.")
      this.db.updateTypeDevice(this.deviceSelected, this.name, this.type)
      this.loadData()
    }, (error) => {
      this.presentToast("Ha ocurriedo un error, vuelva a intentarlo.")
      this.http.dismissLoader()
    })
  }
  scanDevices() {
    /*this.BLEDEVS = []
    console.log(this.BLSE);
    this.BLSE.list().then(d => {
      d.forEach(i => {
        console.log(i);
        this.BLEDEVS.push(i)
      });
    })*/
    //this.le.startScan().subscribe(dev => this.onDeviceDiscovered(dev))
  }
  onDeviceDiscovered(dev) {
    /*this.ngZone.run(() => {
      this.BLEDEVS.push(dev)
    })*/
  }
  onBleChanged(event) {
    /*this.BLSE.connect(this.deviceBLE).subscribe(state => {
      //console.log(state);
    }, e => {
      //console.log(e)
    })*/
  }
  sendSSIDPASS() {
    let data = this.SSID + "," + this.PASS
    /*this.BLSE.write(data).then(state => {
      //console.log(state);
    }, e => {
      //console.log(e)
    })*/

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
      + "&newReadPin=" + this.DHT11.pines.pin1 + "," + this.DHT11.pines.pin2 + "," + this.DHT11.pines.pin3 + "," + this.DHT11.pines.pin4 + "," + this.DHT11.pines.pin5 + "," + this.DHT11.pines.pin6 + "," + this.DHT11.pines.pin7
      + "&newControlPinMin=" + this.DHT11.temperatura.pin_min + "," + this.DHT11.humedad.pin_min + "," + this.DHT11.temperatura.pin_fan
      + "&newControlPinMax=" + this.DHT11.temperatura.pin_max + "," + this.DHT11.humedad.pin_max
      + "&newMin=" + this.DHT11.temperatura.ranges.lower + "," + this.DHT11.humedad.ranges.lower
      + "&newMax=" + this.DHT11.temperatura.ranges.upper + "," + this.DHT11.humedad.ranges.upper
      + "&newIdeal=" + this.DHT11.temperatura.ideal + "," + this.DHT11.humedad.ideal
      + "&active=" + this.disable.DHT
      + "&id=1"
      + "&ip=" + this.myIP
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
      + "&ip=" + this.myIP
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
      + "&ip=" + this.myIP
    //console.log(newData);

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
  updateSensorPH() {
    let newData
    newData = "?newUbiVar=PHgen"
      + "&newReadPin=" + this.PH.pines.pin1
      + "&newControlPinMin=" + this.PH.control_min_pin
      + "&newControlPinMax=" + this.PH.control_max_pin
      + "&newMin=" + this.PH.ranges.lower
      + "&newMax=" + this.PH.ranges.upper
      + "&newIdeal=" + this.PH.ideal
      + "&active=" + this.disable.PH
      + "&id=5"
      + "&ip=" + this.myIP
    //console.log(newData);

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
  updateSensorCond() {
    let newData
    newData = "?newUbiVar=Condgen"
      + "&newReadPin=" + this.Cond.pines.pin1
      + "&newControlPinMin=" + this.Cond.control_min_pin
      + "&newControlPinMax=" + this.Cond.control_max_pin
      + "&newMin=" + this.Cond.ranges.lower
      + "&newMax=" + this.Cond.ranges.upper
      + "&newIdeal=" + this.Cond.ideal
      + "&active=" + this.disable.Cond
      + "&id=6"
      + "&ip=" + this.myIP
    //console.log(newData);

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
      + "&ip=" + this.myIP
    //console.log(newData);
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
  updateSensorCO2() {
    let newData
    newData = "?newUbiVar=CO2"
      + "&newReadPin=" + this.CO2.pines.pin1
      + "&newControlPinMin=" + this.CO2.control_min_pin
      + "&newControlPinMax=" + this.CO2.control_max_pin
      + "&newMin=" + this.CO2.ranges.lower
      + "&newMax=" + this.CO2.ranges.upper
      + "&newIdeal=" + this.CO2.ideal
      + "&active=" + this.disable.CO2
      + "&id=7"
      + "&ip=" + this.myIP
    //console.log(newData);
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
  updateSensorJSN() {
    let newData
    newData = "?newUbiVar=JSN"
      + "&newReadPin=" + this.JSN.pines.pin1 + "," + this.JSN.pines.pin2
      + "&newControlPinMin=" + this.JSN.control_min_pin
      + "&newControlPinMax=" + this.JSN.control_max_pin
      + "&newMin=" + this.JSN.ranges.lower
      + "&newMax=" + this.JSN.ranges.upper
      + "&newIdeal=" + this.JSN.ideal
      + "&active=" + this.disable.JSN
      + "&id=9"
      + "&ip=" + this.myIP
    //console.log(newData);
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
  updateSensorLUM() {
    let newData
    newData = "?newUbiVar=Luminosidad"
      + "&newReadPin=0"
      + "&newControlPinMin=" + this.LUM.control_min_pin
      + "&newControlPinMax=" + this.LUM.control_max_pin
      + "&newMin=" + this.LUM.ranges.lower
      + "&newMax=" + this.LUM.ranges.upper
      + "&newIdeal=" + this.LUM.ideal
      + "&active=" + this.disable.LUM
      + "&id=8"
      + "&ip=" + this.myIP
    //console.log(newData);
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
    if (id == "404") {
      this.ipDeviceSelected = "192.168.4.1"
      this.tryCheck()
      //console.log(this.ipDeviceSelected);
    } else {
      this.db.getDevice(id).then(_ => {
        this.ipDeviceSelected = _.ip
        this.tryCheck()
        //console.log(this.ipDeviceSelected);
      })
    }
    //console.log(this.ipDeviceSelected);
  }
  openLogger() {
    let params: any = {
      "ip": this.ipDeviceSelected
    }
    this.nav.navigateForward(['/logger'], { state: params })
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
            } else if (thing == 'Cond') {
              this.updateSensorCond()
            } else if (thing == 'PH') {
              this.updateSensorPH()
            } else if (thing == 'YL') {
              this.updateSensorYL()
            } else if (thing == 'CO2') {
              this.updateSensorCO2()
            } else if (thing == 'JSN') {
              this.updateSensorJSN()
            } else if (thing == 'LUM') {
              this.updateSensorLUM()
            }
          }
        }
      ],
      cssClass: 'alert_success',
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
        }
      ],
      cssClass: 'alert_success',

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
          type: 'number',
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
            } else if (sensor == 'Cond') {
              this.disable.Cond = !this.disable.Cond
            } else if (sensor == 'PH') {
              this.disable.PH = !this.disable.PH
            } else if (sensor == 'YL') {
              this.disable.YL = !this.disable.YL
            } else if (sensor == 'CO2') {
              this.disable.CO2 = !this.disable.CO2
            } else if (sensor == 'JSN') {
              this.disable.JSN = !this.disable.JSN
            } else if (sensor == 'LUM') {
              this.disable.LUM = !this.disable.LUM
            }
          }
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: (data) => { //takes the data
            if (data.password != "0000") {
              if (sensor == 'DHT') {
                this.disable.DHT = !this.disable.DHT
              } else if (sensor == 'Oxy') {
                this.disable.Oxy = !this.disable.Oxy
              } else if (sensor == 'PH') {
                this.disable.PH = !this.disable.PH
              } else if (sensor == 'Cond') {
                this.disable.Cond = !this.disable.Cond
              } else if (sensor == 'Ds18') {
                this.disable.DS18 = !this.disable.DS18
              } else if (sensor == 'YL') {
                this.disable.YL = !this.disable.YL
              } else if (sensor == 'LUM') {
                this.disable.LUM = !this.disable.LUM
              } else if (sensor == 'CO2') {
                this.disable.CO2 = !this.disable.CO2
              } else if (sensor == 'JSN') {
                this.disable.JSN = !this.disable.JSN
              }
              this.presentToast("Contraseña no válida.")
            } else {
              this.presentToast("Estado del sensor: actualizado.")
            }
          }
        }
      ],
      cssClass: 'alert_success',

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
          type: 'number',
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
            if (data.password != "0000") {
              this.ImAdmin = false;
              this.presentToast("Contraseña no válida.")
            } else {
              this.ImAdmin = true;
              this.show.DHT = false
              this.show.DS18 = false
              this.show.Cond = false
              this.show.Oxy = false
              this.show.YL = false
              this.show.CO2 = false
              this.show.LUM = false
              this.show.PH = false
              this.presentToast("Eres admin.")
            }
          }
        }
      ],
      cssClass: 'alert_success',

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
      ],
      cssClass: 'alert_success',

    });

    await alert.present();
    alert.onDidDismiss().then(() => {
      //this.nav.back()
      this.nav.navigateRoot("")
    });
  }
  async showTag(txt1, txt2) {
    /*let txt1 = String(txt.split("?")[0])
    let txt2 = String(txt.split("?")[1]) */
    const alert = await this.alertController.create({
      header: 'Recomendaciones',
      message: "<ul>"
        + "<li>" + txt1 + "</li>"
        + "<li>" + txt2 + "</li>"
        + "</ul>",
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
      ],
      cssClass: 'alert_success',
    });

    await alert.present();
  }
  pinFormatter(value: number) {
    return `${value} cm`;
  }
}
