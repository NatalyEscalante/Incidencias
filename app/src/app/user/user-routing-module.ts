import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserIndex } from './user-index/user-index';
//import { UserCreate } from './user-create/user-create';
import { UserLogin } from './user-login/user-login';
const routes: Routes = [
  {
    
    path: 'usuario',component: UserIndex,
    children: [
     // { path: 'registrar', component: UserCreate },
      { path: 'login', component: UserLogin },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
