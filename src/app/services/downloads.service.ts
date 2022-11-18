import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
//import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Injectable({
  providedIn: 'root'
})
export class DownloadsService {

  //ipDevice = '192.168.1.66'

  constructor(
    private fileOpener: FileOpener,
    private papa: Papa,
    public transfer: FileTransfer,
    public file: File,
    private httpClient: HttpClient,
    //private socialSharing: SocialSharing
  ) { }
/*
  downloadCSV(ipDevice) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = 'http://' + ipDevice + '/getFileOxygen';
    fileTransfer.download(url, this.file.externalDataDirectory + 'oxygen1.csv').then((entry) => {
      //console.log('Path: ' + this.file.dataDirectory);
      console.log('download complete: ' + entry.toURL());

    }, (error) => {

      // handle error
    });

  }*/
  async ShareFile(rute) {
    this.fileOpener.showOpenWithDialog(rute, 'text/csv')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));

  }
  readFile = async (rute) => {
    const contents = await Filesystem.readFile({
      //path: this.file.externalDataDirectory+'oxygen1.csv',
      path: rute,
      encoding: Encoding.UTF8,
    })
    this.papa.parse(contents.data)
    let parsedData = this.papa.parse(contents.data).data.reverse();
    parsedData.splice(0, 1);
    //console.log(parsedData);
    return parsedData;
  }
  readLog = async (rute) => {
    const contents = await Filesystem.readFile({
      //path: this.file.externalDataDirectory+'oxygen1.csv',
      path: rute,
      encoding: Encoding.UTF8,
    })
    this.papa.parse(contents.data)
    let parsedData = this.papa.parse(contents.data).data;
    parsedData.splice(0, 1);
    //console.log(parsedData);
    return parsedData;
  }

  async shareFile() {
    /*this.socialSharing.canShareViaEmail().then((_) => {
      console.log(_);
    }).catch(e => {
      console.log(e);
    });*/
  }
}
