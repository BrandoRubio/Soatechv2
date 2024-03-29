import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { AlertController, IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('slide') slide: IonSlides;
  slideOptsOne = {
    initialSlide: 0,
    autoplay: {
      autoplay: false,
      delay: 3500
    },
    slidesPerView: 1,
    speed: 1000,
  };
  name: String
  company: String
  sector: String
  ubicacion: String
  correo: String
  telefono: String
  constructor(
    private storage: Storage,
    private alertController: AlertController,
    private emailComposer: EmailComposer,
    private router: Router,
  ) { }

  async ngOnInit() {
    await this.storage.create()
  }
  ionViewWillEnter() {
    this.slide.stopAutoplay()
    this.loadProfile()
  }
  startSlides() {
    this.slide.slideNext()
    this.slide.startAutoplay()
  }
  ionViewWillLeave() {
    this.slide.slideTo(0)
    this.slide.stopAutoplay()
  }
  async loadProfile() {
    await this.storage.get("name").then((res) => {
      this.name = res
    });
    await this.storage.get("company").then((res) => {
      this.company = res
    });
    await this.storage.get("sector").then((res) => {
      this.sector = res
    });
    await this.storage.get("telefono").then((res) => {
      this.telefono = res
    });
    await this.storage.get("ubicacion").then((res) => {
      this.ubicacion = res
    });
    await this.storage.get("correo").then((res) => {
      this.correo = res
    });
  }
  requestSector(sect) {
    this.loadProfile().then(() => {
      if (this.name && this.company  && this.sector && this.ubicacion && this.telefono && this.correo) {
        this.openEmail(sect)
      } else {
        this.loadProfile().then(() => {
          if (this.name && this.company  && this.sector && this.ubicacion && this.telefono && this.correo) {
            this.openEmail(sect)
          } else {
            this.showAlert()
          }
        });
      }
    });
  }
  openEmail(sect) {
    let email = {
      app: 'gmail',
      to: 'soatech.condor@gmail.com',
      cc: 'fernando.calleja.condor@gmail.com, uzziel.perez.condor@gmail.com, brando.rubio.condor@gmail.com',
      attachments: [

      ],
      subject: 'Requiero una solución para sector ' + sect,
      body: 'Hola qué tal, soy ' + this.name + ' y trabajo en ' + this.company + ' en el sector ' + this.sector +
        ' con sede en '+ this.ubicacion+'.'+
        '\nMe interesaría recibir información de su solución en el sector  ' + this.sector + ', para ello facilito mi teléfono que es ' + this.telefono+'.'+
        '\n\nCorreo: ' + this.correo +
        '\n\n*Puedes adicionar más información*',
      isHtml: false
    }
    //this.emailComposer.addAlias('gmail', 'com.google.android.gm')
    this.emailComposer.open(email);
  }
  openSoatechBot(){
    window.open("https://wa.me/+525530368048", '_system');
  }
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: "Antes de solicitar una de las soluciones de <b>Soatech</b> primero debes ingresar tus datos para conocerte mejor y ofrecerte el mejor servicio.",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          },
        },
        {
          text: 'Continuar',
          role: 'confirm',
          //cssClass: 'alert-button-confirm',
          handler: () => {
            this.router.navigate(['/profile'])
            //this.descargarArchivo
          },
        },
      ],
      cssClass: 'alert_success',
    });

    await alert.present();
  }
}
