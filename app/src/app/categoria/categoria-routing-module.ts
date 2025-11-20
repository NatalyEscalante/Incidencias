import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaIndex } from './categoria-index/categoria-index';
import { CategoriaDetails } from './categoria-details/categoria-details';
import { CategoriaAdmin } from './categoria-admin/categoria-admin';
import { CategoriaForm } from './categoria-form/categoria-form';

const routes: Routes = [
  { path: 'categoria', component: CategoriaIndex },
  { path: 'categoria-admin', component: CategoriaAdmin},
  { path: 'categoria/create', component: CategoriaForm },
  { path: 'categoria/update/:id', component: CategoriaForm},
  {
    path: 'categoria/:id',
    component: CategoriaDetails,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaRoutingModule { }
