import { Component } from '@angular/core';
import { DownloadsService } from '../services/downloads.service';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DbService } from '../services/db.service';
import { HttpService } from '../services/http.service';

import { RangeCustomEvent } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { RangeValue } from '@ionic/core';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  devices: any[] = []

  //--------General--------//
  data: []
  ipDeviceSelected = ""
  lineChart: any;
  dateMinR: String
  dateMaxR: String
  dateMin: String
  dateMax: String
  //dateMinValid: String
  //dateMaxValid: String
  deviceSelected = ""
  deviceType = ""
  files: []
  netMsg = ""
  sdCardMsg = ""
  numFiles: number = 0
  fileSelected = ""
  elementName = ""
  ruteFile = ""
  firstTime = true
  intervalo
  rangeKnobs: any = {
    upper: 0,
    lower: 100
  }
  disableFileChooser = true
  optionsDevice = {
    header: 'Dispositivos',
    subHeader: 'Selecciona un dispositivo',
  };
  optionsFiles = {
    header: 'Archivos',
    subHeader: 'Selecciona un archivo',
  };
  components = {
    AskingDevice: false,
    NoDevice: true,
    WithoutDevices: true,
    Grafics: true
  }
  showChart: Boolean = true
  constructor(
    private alertController: AlertController,
    private down: DownloadsService,
    public transfer: FileTransfer,
    public file: File,
    public db: DbService,
    private http: HttpService,
  ) {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
  }
  async ShareFile() {
    this.down.ShareFile(this.ruteFile);
  }
  changeDevice(dev) {
    this.deviceSelected = dev.target.value;
    this.getDeviceData(this.deviceSelected);
  }
  async changeFile(fil) {
    this.fileSelected = fil.target.value;
    if (fil.target.value == undefined) {
      this.db.presentToast("Seleccione un archivo.")
    } else {
      switch (this.fileSelected) {
        case "oxygen.csv":
          this.elementName = "Oxigenación"
          break;
        case "ph.csv":
          this.elementName = "PH"
          break;
        case "temperature.csv":
          this.elementName = "Temperatura"
          break;
        case "conductivity.csv":
          this.elementName = "Conductividad"
          break;
        default:
          this.elementName = this.fileSelected;
          break;
      }
      this.descargarArchivo()

    }
  }
  async descargarArchivo() {
    this.http.presentLoadingEtern("Descargando archivo")
    await this.downloadFileCSV(this.fileSelected, this.ipDeviceSelected).then(r => {
      //console.log(d);
      //this.ruteFile = 
    })
    if (this.ruteFile == "none") {
      this.intervalo = setInterval(() => {
        this.getDevices();
        //console.log("repeat");
      }, 6000);
    } else {
      await this.readFile(this.ruteFile)
      this.rangeKnobs = {
        lower: 0,
        upper: 100
      }
    }
  }
  ionViewWillEnter() {
    this.getDevices()
  }
  getDevices() {
    this.db.getDevices().then(_ => {
      this.devices = _
      if (this.devices.length == 0) {
        this.components.NoDevice = true;
        this.components.Grafics = true;
        this.components.AskingDevice = true;
        this.components.WithoutDevices = false;
      } else if (this.firstTime) {
        //this.components.NoDevice = true;
        this.components.WithoutDevices = true;
        this.components.Grafics = true;
        this.components.AskingDevice = false;
        this.deviceSelected = _[0].id
        this.firstTime = false
      } else {
        //this.components.NoDevice = true;
        this.components.AskingDevice = true;
        this.components.Grafics = true;
        this.getDeviceData(this.deviceSelected)
      }
    })
  }

  async downloadFileCSV(fileName, ipDevice) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = 'http://' + ipDevice + '/createFileFrom?fileName=' + fileName;
    await fileTransfer.download(url, this.file.externalDataDirectory + fileName).then((entry) => {
      this.http.dismissLoader()
      console.log('download complete: ' + entry.toURL());
      //console.log(entry);
      this.ruteFile = this.file.externalDataDirectory + fileName;
    }, (error) => {
      console.log(error);
      this.http.dismissLoader()
      this.ruteFile = "none"
      this.components.NoDevice = false;
      this.components.Grafics = true;
      this.components.AskingDevice = true;
      this.components.WithoutDevices = true;
      //return error
      // handle error
    });
  }
  getDeviceData(id) {
    this.db.getDevice(id).then(_ => {
      //console.log(_);
      this.ipDeviceSelected = _.ip
      this.deviceType = _.type
      if (this.deviceType) {
        this.http.getAllFileNames(this.ipDeviceSelected).subscribe(data => {
          clearInterval(this.intervalo)
          //console.log(data);
          this.components.AskingDevice = true;
          this.components.NoDevice = true;
          this.components.Grafics = false;
          this.files = data.files
          this.netMsg = data.msjnet;
          this.sdCardMsg = data.msjsd
          try {
            this.numFiles = this.files.length
          } catch (exceptionVar) {
            this.numFiles = 0
          }
          if (this.numFiles == 0) {
            this.numFiles = 0
            this.disableFileChooser = true
          } else {
            this.disableFileChooser = false
          }
        }, error => {
          this.components.WithoutDevices = true;
          this.components.AskingDevice = true;
          this.components.Grafics = true;
          this.components.NoDevice = false;
        });
      }
    }, error => {
      this.components.WithoutDevices = true;
      this.components.AskingDevice = true;
      this.components.Grafics = true;
      this.components.NoDevice = false;
    });
  }
  async readFile(rute) {
    this.http.dismissLoader()
    this.showChart = false
    this.down.readFile(rute).then(_ => {
      if (this.lineChart) {
        this.lineChart.destroy();
      }
      this.data = _
      const fechas: string[] = []
      const valores: number[] = []

      if (_.length > 1) {
        this.dateMin = _[0][1]
        this.dateMax = _[_.length - 2][1]
      } else {
        this.dateMin = "0000-00-00T00:00:00"
        this.dateMax = "0000-00-00T00:00:00"
      }

      for (let i = 0; i < this.data.length; i++) {
        fechas.push(this.data[i][1]);
        valores.push(this.data[i][2]);
      }
      this.lineChartMethod(valores, fechas, this.elementName).then(_ => {
        this.http.dismissLoader()
      })
    })
    //console.log("Read");
  }
  async emptyFile() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: "¿Estás seguro que deseas eliminar los registros del archivo <b>" + this.fileSelected + "</b>?",
      buttons: [
        {
          text: 'Atrás',
          role: 'cancel',
          cssClass: 'alert-button-delete',
          handler: () => {

          },
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          cssClass: 'alert-button-delete',
          handler: () => {
            this.http.emptyFile(this.ipDeviceSelected, this.fileSelected).subscribe(_ => {
              if (_.status == "ok") {
                this.http.presentToast("Registros de " + this.fileSelected + " eliminados.")
                this.descargarArchivo()
              }
              //this.descargarArchivo
            })
          },
        },
      ],
      cssClass: 'alert_success',
    });

    await alert.present();
  }
  refrescar(event) {
    this.getDevices()
    setTimeout(() => {
      event.target.complete();
    }, 2500);
  }
  async fileFilter(min, max, data) {

    const fechas: string[] = []
    const valores: number[] = []
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    for (let i = 0; i < data.length; i++) {
      const porcentaje = i * 100 / data.length;

      if (porcentaje >= min && porcentaje <= max) {
        fechas.push(data[i][1]);
        valores.push(data[i][2]);
      }
    }
    this.dateMin = fechas[0]
    this.dateMax = fechas[fechas.length - 2]
    await this.lineChartMethod(valores, fechas, this.elementName)
  }
  onIonKnobMoveEnd(ev: Event) {
    this.rangeKnobs = (ev as RangeCustomEvent).detail.value;
    this.fileFilter(this.rangeKnobs.lower, this.rangeKnobs.upper, this.data).then(_ => {
      this.http.dismissLoader()
    })
  }
  async lineChartMethod(datos, fechas, name) {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [
          {
            label: name,
            fill: false,
            tension: 0,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: datos,
            spanGaps: false,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              display: false
            },
            display: false,
            title: {
              display: false,
              color: 'rgba(66, 111, 245,1)',
              font: {
                family: 'Comic Sans MS',
                size: 12,
                lineHeight: 1.2,
              },
              //padding: { top: 20, left: 0, right: 0, bottom: 0 }
            }
          }
        }
      }
    });
    //this.lineChart.size("height:20vh; width:40vw")
  }
}
