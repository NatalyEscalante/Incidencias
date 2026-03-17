import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AsignacionRoutingModule } from './asignacion-routing-module'; 

import { AsignacionIndex } from './asignacion-index/asignacion-index';
import { Automatico } from './automatico/automatico';
import { ManualComponent } from './asignacion-manual/asignacion-manual';

// Angular Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AsignacionIndex,
    Automatico,  
    ManualComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AsignacionRoutingModule,
    
    // Angular Material modules
    MatIconModule,  // ✅ Aquí está importado
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule
  ]
})
export class AsignacionModule { }