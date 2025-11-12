import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionIndex } from './asignacion-index/asignacion-index';

const routes: Routes = [
  { path: 'asignacion', component: AsignacionIndex },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionRoutingModule { }
