import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private router: Router,
    private alertController: AlertController,
    ) {
   }

  listeners(){
    LocalNotifications.addListener('localNotificationActionPerformed',(action) => {
      let n = action.notification
      console.log(n.iconColor);
      if(n.iconColor == "#2dd36f"){
        this.showAlertRangeOK(n.elemento, n.valor, n.hora, n.rangos)
      }else{
        this.showAlertOutRange(n.elemento, n.valor, n.hora, n.rangos)
      }
    })
  }
  async showAlertOutRange(elemento, valor, hora, rangos) {
    this.router.navigate(['/tabs', 'tab4'])
    const alert = await this.alertController.create({
      header: "Notificación",
      message:"<b>SoatechApp</b>"+
      "<br>El elemento se encuentra fuera del rango establecido:"+
      `
      <ul class="sin-sangria">
        <br><li><b>Elemento</b>: `+elemento+`</li>
        <li><b>Valor</b>: `+ valor+`</li>
        <li><b>Rangos</b>: `+ rangos+`</li>
        <li><b>Hora</b>: `+ hora+`</li>
      </ul>
    `,
    buttons: [
        {
          text: 'ok',
          role: 'confirm',
        }
      ],
      cssClass: 'alert_danger'
    });
    await alert.present();
  }
  async showAlertRangeOK(elemento, valor, hora, rangos) {
    this.router.navigate(['/tabs', 'tab4'])
    const alert = await this.alertController.create({
      header: "Notificación",
      message: "<b>SoatechApp</b>"+
      "<br>El elemento regresó al rango establecido:"+
      `
      <ul class="sin-sangria">
        <br><li><b>Elemento</b>: `+elemento+`</li>
        <li><b>Valor</b>: `+ valor+`</li>
        <li><b>Rangos</b>: `+ rangos+`</li>
        <li><b>Hora</b>: `+ hora+`</li>
      </ul>
    `,
      buttons: [
        {
          text: 'ok',
          role: 'confirm',
        }
      ],
      cssClass: 'alert_success',
    });
    await alert.present();
  }
}
