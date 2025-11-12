import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketIndex } from './ticket-index/ticket-index';
import { TicketDetail } from './ticket-detail/ticket-detail';

const routes: Routes = [
  { path: 'ticket', component: TicketIndex },
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
