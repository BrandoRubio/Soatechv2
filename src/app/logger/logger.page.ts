import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { NavController, ToastController, AlertController, Platform } from '@ionic/angular';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Router } from '@angular/router';
import { DownloadsService } from '../services/downloads.service';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.page.html',
  styleUrls: ['./logger.page.scss'],
})
export class LoggerPage implements OnInit {
  ipDeviceSelected = ""
  rutas: any
  ruteSelected
  filesLogger: any = []
  filesLogging: any = []
  filesUserLogging: any = []
  files: any
  nFiles : number = 0
  disableFiles = true
  fileSelected
  data = []
  header = true
  file = {
    name: "",
    size: "0",
    rute: ""
  }
  dfile = {
    name: "",
    size: "0",
    rute: ""
  }
  constructor(
    private router: Router,
    private nav: NavController,
    private down: DownloadsService,
    private alertController: AlertController,
    public transfer: FileTransfer,
    public fm: File,
    private http: HttpService,) {
    if (router.getCurrentNavigation().extras.state) {
      const pageName = this.router.getCurrentNavigation().extras.state;
      //console.log(pageName)
      this.ipDeviceSelected = pageName.ip
    }
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.http.presentLoadingEtern("Obteniendo datos")
    this.getFilesFromSD();
  }
  changesRute() {
    if (this.ruteSelected == "Logger") {
      this.files = this.filesLogger.reverse();
      this.nFiles = this.filesLogger.length
    }
    if (this.ruteSelected == "Logging") {
      this.files = this.filesLogging.reverse();
      this.nFiles = this.filesLogging.length
    }
    if (this.ruteSelected == "UserLogging") {
      this.files = this.filesUserLogging.reverse();
      this.nFiles = this.filesUserLogging.length
    }
    this.disableFiles = this.nFiles ? false : true
  }
  changesFile() {
    this.files.forEach(i => {
      if (i.name == this.fileSelected) {
        this.file.rute = i.rute
        this.file.name = i.name
        this.file.size = i.size
        //Descargar archivo
        this.descargarArchivo()
      }
    });
  }
  async descargarArchivo() {
    this.http.presentLoadingEtern("Descargando archivo")
    await this.downloadFileCSV(this.file.name, this.file.rute).then(r => {
      this.readFile(this.dfile.rute)
    })
  }
  async downloadFileCSV(fileName, fileRoute) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = 'http://' + this.ipDeviceSelected + '/getFile?fileName=' + fileName + "&fileRoute=" + fileRoute;
    await fileTransfer.download(url, this.fm.externalDataDirectory + fileName).then((entry) => {
      this.http.dismissLoader()
      //console.log(entry);
      this.dfile.rute = this.fm.externalDataDirectory + fileName;
    }, (error) => {
      console.log(error);
      this.http.dismissLoader()
      this.dfile.rute = "none"
      //return error
      // handle error
    });
  }
  async readFile(rute) {
    this.down.readLog(rute).then(_ => {
      //this.data = _
      this.data = [];
      let logs : [] = _.reverse()
      
      for (let i = 0; i < logs.length-1; i++) {
        const log = {
          hora : String(logs[i][0]),
          text : String(logs[i][3]),
          color : String(logs[i][2]) == "[INFO] " ? "success" : "danger",
          tipo : String(logs[i][2])
        }
        this.data.push(log);
      }
      if(this.data.length > 0){
        this.header = false
        this.http.dismissLoader()
      }else{
        this.header = true
        this.http.dismissLoader()
      }
    })
  }
  getFilesFromSD() {
    this.http.getDirs(this.ipDeviceSelected).subscribe((_) => {
      this.rutas = _.DIRS
      this.filesUserLogging = _.UserLogging
      this.filesLogger = _.Logger
      this.filesLogging = _.Logging
      setTimeout(() => {
        this.http.dismissLoader()
      }, 100);
    }, (error) => {

    })

  }
  async details(hora, tipo, msj) {
    const alert = await this.alertController.create({
      header: 'Detalles',
      message:  "<ul>"
      + "<li><b>Hora:</b> " + hora + "</li>"
      + "<li><b>Tipo:</b> " + tipo + "</li>"
      + "<li><b>Mensaje:</b> " + msj + "</li>"
      + "</ul>",
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
      ]
    });

    await alert.present();
  }
}
