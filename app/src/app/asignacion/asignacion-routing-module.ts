// asignacion-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionIndex } from './asignacion-index/asignacion-index';
import { Automatico } from './automatico/automatico';
import { ManualComponent } from './asignacion-manual/asignacion-manual';

const routes: Routes = [
  { path: 'asignacion', component: AsignacionIndex },
  { path: 'automatico', component: Automatico },
  { path: 'manual', component: ManualComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionRoutingModule { }