import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaIndex } from './categoria-index/categoria-index';
import { CategoriaDetails } from './categoria-details/categoria-details';

const routes: Routes = [
  { path: 'categoria', component: CategoriaIndex },
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
