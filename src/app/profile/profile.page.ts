import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private storage: Storage) { }
  name: String
  company: String
  sector: String
  ubicacion: String
  rol: String
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
    this.storage.get("rol").then((res) => {
      this.rol = res
    });
    this.storage.get("sector").then((res) => {
      this.sector = res
    });
    this.storage.get("telefono").then((res) => {
      this.telefono = res
    });
    this.storage.get("correo").then((res) => {
      this.correo = res
    });
  }
  ionViewWillLeave() {
    this.storage.set("name", this.name)
    this.storage.set("company", this.company)
    this.storage.set("sector", this.sector)
    this.storage.set("telefono", this.telefono)
    this.storage.set("rol", this.rol)
    this.storage.set("correo", this.correo)
  }

  changeForm(){
    if (this.name && this.company && this.rol && this.sector && this.telefono && this.correo) {
      this.text = ""
    }else{
      this.text = "Ingresa los datos restantes"
    }
  }
}
