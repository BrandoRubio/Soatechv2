import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggerPage } from './logger.page';

const routes: Routes = [
  {
    path: '',
    component: LoggerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoggerPageRoutingModule {}
