import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TheftReportPage } from './theft-report.page';

const routes: Routes = [
  {
    path: '',
    component: TheftReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TheftReportPageRoutingModule {}
