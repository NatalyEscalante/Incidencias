import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketIndex } from './ticket-index/ticket-index';
import { TicketDetail } from './ticket-detail/ticket-detail';
import { TicketAdmin } from './ticket-admin/ticket-admin';
import { TicketForm } from './ticket-form/ticket-form';

const routes: Routes = [
  { path: 'ticket', component: TicketIndex },
  { path: 'ticket-admin', component: TicketAdmin},
  { path: 'ticket/create', component: TicketForm },
  { path: 'ticket/update/:id', component: TicketForm},
  {
    path: 'ticket/:id',
    component: TicketDetail,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
