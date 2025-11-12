import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsignacionRoutingModule } from './asignacion-routing-module';
import { AsignacionIndex } from './asignacion-index/asignacion-index';

// Angular Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AsignacionIndex
  ],
  imports: [
    CommonModule,
    AsignacionRoutingModule,
    // Angular Material modules
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatTooltipModule
  ]
})
export class AsignacionModule { }
