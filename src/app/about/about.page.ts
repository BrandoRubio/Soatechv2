import { Component, OnInit } from '@angular/core';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(
    private emailComposer: EmailComposer) { }

  ngOnInit() {
  }

  openCondorPage(){
    window.open("https://i-condor.com", '_system');
  }

  openGmail(){
    let email = {
      app: 'gmail',
      to: 'fernando.calleja.condor@gmail.com'
    }
    this.emailComposer.open(email);
  }
}
