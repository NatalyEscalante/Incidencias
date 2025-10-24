import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';

const routes: Routes = [
  { path: 'inicio', component: Inicio }, 
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
