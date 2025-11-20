import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TecnicoIndex } from './tecnico-index/tecnico-index';
import { TecnicoDetail } from './tecnico-detail/tecnico-detail';
import { TecnicoAdmin } from './tecnico-admin/tecnico-admin';
import { TecnicoForm } from './tecnico-form/tecnico-form';

const routes: Routes = [
  { path: 'tecnico', component: TecnicoIndex },
  { path: 'tecnico-admin', component: TecnicoAdmin},
  { path: 'tecnico/create', component: TecnicoForm },
  { path: 'tecnico/update/:id', component: TecnicoForm},
  {
    path: 'tecnico/:id',
    component: TecnicoDetail,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TecnicoRoutingModule { }
