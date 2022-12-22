import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private storage: Storage,
    private toastController: ToastController) { }
  name: String
  company: String
  sector: String
  ubicacion: String
  correo: String
  telefono: String
  text: String = "Ingresa los datos restantes"
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.storage.get("name").then((res) => {
      this.name = res
    });
    this.storage.get("company").then((res) => {
      this.company = res
    });
    this.storage.get("sector").then((res) => {
      this.sector = res
    });
    this.storage.get("telefono").then((res) => {
      this.telefono = res
    });
    this.storage.get("ubicacion").then((res) => {
      this.ubicacion = res
    });
    this.storage.get("correo").then((res) => {
      this.correo = res
    });
  }
  ionViewWillLeave() {
    this.store()
  }
  store(){
    this.storage.set("name", this.name)
    this.storage.set("company", this.company)
    this.storage.set("sector", this.sector)
    this.storage.set("telefono", this.telefono)
    this.storage.set("ubicacion", this.ubicacion)
    this.storage.set("correo", this.correo)
  }
  changeForm(){
    if (this.name && this.company && this.sector && this.telefono && this.ubicacion && this.correo) {
      this.text = ""
    }else{
      this.text = "Ingresa los datos restantes"
    }
  }
  saveData(){
    this.store()
    if(this.name && this.company && this.sector && this.telefono && this.ubicacion && this.correo){
      this.presentToast('Datos guardados con éxito.', 'checkmark')
    }else{
      this.presentToast('Llene todos los campos.','information')
    }
  }
  async presentToast(msj, ico) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 1500,
      icon: ico
    });

    await toast.present();
  }
}
