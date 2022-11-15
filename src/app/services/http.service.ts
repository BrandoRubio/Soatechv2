import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LoadingController, ToastController } from '@ionic/angular';
import { timeout} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  endpoint = 'http://';
  constructor(
    private toastController: ToastController,
    private httpClient: HttpClient,
    public loadingController: LoadingController
  ) { }

  changeParams(ip, params): Observable<any> {
    return this.httpClient.get(this.endpoint + ip + "/updateDevice"+params)
  }
  changeParamsSensor(ip, params): Observable<any> {
    return this.httpClient.get(this.endpoint + ip + "/updateSensor"+params)
  }
  emptyFile(ipDevice, file): Observable<any> {
    return this.httpClient.get(this.endpoint + ipDevice + "/emptyFile?fileName="+file)
  }

  getParams(ip): Observable<any> {
    return this.httpClient.get(this.endpoint + ip + "/getParams")
  }
  getSensors(ip): Observable<any> {
    return this.httpClient.get(this.endpoint + ip + "/getSensors")
  }
  getAllElementValues(ipDevice): Observable<any> {
    return this.httpClient.get(this.endpoint + ipDevice + "/getLastNValues")
  }

  getAllFileNames(ipDevice): Observable<any> {
    return this.httpClient.get(this.endpoint + ipDevice + "/getAllItems")
  }
  checkDevice(ip): Observable<any> {
    return this.httpClient.get(this.endpoint + ip + "/checkDevice", ).pipe(
      timeout(10000)
    );
  }
  checkDeviceCM(ip): Observable<any> {
    return this.httpClient.get(this.endpoint + ip + "/checkDevice", ).pipe(
      timeout(10000)
    )
  }
  getLastValues(ip): Observable<any> {
    return this.httpClient.get(this.endpoint + ip + "/getLastValues", ).pipe(
      timeout(8000)
    );
  }

  getFile(ip): Observable<any> {
    return this.httpClient.get(this.endpoint + ip + "/getFile", ).pipe(
      timeout(10000)
    );
  }

  getNetworks(ipDevice): Observable<any> {
    return this.httpClient.get(this.endpoint + ipDevice + "/getNetworks")
  }

  async presentLoadingWithOptions(msg) {
    const loading = await this.loadingController.create({
      spinner: 'dots',
      duration: 10000,
      message: msg,
      translucent: true,
    });

    return await loading.present();
  }
  async presentLoadingEtern(msg) {
    const loading = await this.loadingController.create({
      spinner: 'dots',
      message: msg,
      translucent: true,
    });

    return await loading.present();
  }


  dismissLoader() {
    this.loadingController.getTop().then(v => v ? this.loadingController.dismiss() : null);
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
