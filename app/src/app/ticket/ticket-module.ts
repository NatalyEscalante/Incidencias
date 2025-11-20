import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing-module';
import { TicketIndex } from './ticket-index/ticket-index';
import { TicketDetail } from './ticket-detail/ticket-detail';

// Angular Material imports
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TicketAdmin } from './ticket-admin/ticket-admin';
import { TicketForm } from './ticket-form/ticket-form';

//Imports forms
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'; 
import { MatSelectModule } from '@angular/material/select'; 

@NgModule({
  declarations: [
    TicketIndex,
    TicketDetail,
    TicketAdmin,
    TicketForm
  ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, 
    ReactiveFormsModule
  ]
})
export class TicketModule { }
