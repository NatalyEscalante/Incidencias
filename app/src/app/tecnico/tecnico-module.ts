import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TecnicoRoutingModule } from './tecnico-routing-module';
import { TecnicoIndex } from './tecnico-index/tecnico-index';
import { TecnicoDetail } from './tecnico-detail/tecnico-detail';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { TecnicoAdmin } from './tecnico-admin/tecnico-admin';
import { TecnicoForm } from './tecnico-form/tecnico-form';

//Imports forms
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'; 
import { MatSelectModule } from '@angular/material/select'; 

@NgModule({
  declarations: [
    TecnicoIndex,
    TecnicoDetail,
    TecnicoAdmin,
    TecnicoForm
  ],
  imports: [
    CommonModule,
    TecnicoRoutingModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, 
    ReactiveFormsModule
  ]
})
export class TecnicoModule { }
