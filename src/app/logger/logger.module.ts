import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoggerPageRoutingModule } from './logger-routing.module';

import { LoggerPage } from './logger.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoggerPageRoutingModule
  ],
  declarations: [LoggerPage]
})
export class LoggerPageModule {}
