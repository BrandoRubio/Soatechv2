import { Component, OnInit } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-google',
  templateUrl: './google.page.html',
  styleUrls: ['./google.page.scss'],
})
export class GooglePage implements OnInit {
  user : any = false
  constructor(
    private http: HttpService,
    private platform : Platform
  ) {
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      GoogleAuth.initialize()
    })
  }
  ngOnInit() {
  }
  async signIn(){
    this.user = await GoogleAuth.signIn()
    //const credential = auth.GoogleAuthProvider.credential(this.user.authentication.idToken);
    console.log(this.user);
  }
  async signOut(){
    await GoogleAuth.signOut()
  }
  async refresh(){
    //this.http.sendToGoogle("","eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzYmRiZmRlZGUzYmFiYjI2NTFhZmNhMjY3OGRkZThjMGIzNWRmNzYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3Njg4Nzg1OTM5NTctMjlicDEyNHQ4a2E0MjhtYmFxdmJvdXFmNThrODRubjUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3Njg4Nzg1OTM5NTctYTJhNXVjMXM0cHY4NTlnc3RnOXRxZ3VyOXVuMjVlNTkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTMzOTM5OTk1OTUyNjY1MDI5NjMiLCJlbWFpbCI6InNhbmNoZXpicmFuZG8xOTdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJCcmFuZG8gUi4gUnViaW8gU2FuY2hleiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRjSlBQVnVEWVh2MngydjhYVHAyMGd5cmRpY3ptTER6MWd0QWV5X2pwd3dHX0pFPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkJyYW5kbyBSLiIsImZhbWlseV9uYW1lIjoiUnViaW8gU2FuY2hleiIsImxvY2FsZSI6ImVzLTQxOSIsImlhdCI6MTY5MDMwNzgxMiwiZXhwIjoxNjkwMzExNDEyfQ.G36HI3qHH4D3w81vjv8wpcBN427yl9fukZvJiwSzaNJuP1BxJ18VjK21rbRMJnJC5CLKtSMFynmQeL-ccrBk98Xv22ZvWGqAevC8kGRWdu642Hs6c-r4gHrsvZQ8Io9Rr1yiajq1vrGrwJgzcme1QGMu01xoGds1SfKfezMwgBHKXUfri-Dhazx9bHLCMiDL4c8LoO_RW464Rynnixw1Np5MqnNNlrRhKTvcP0MEeiMe6gYgZXeKwQ66K8xPYf9cANtuAaB7wSPphJ3O7ZFeDvFf0mNzS-_EOpI0Zz3Fvj9v7qvve1z1R9O17KyWwFA70Tqg6Jq3bApPcPmws1VqLg")
  }
  async sendHTTP(){

  }
}
