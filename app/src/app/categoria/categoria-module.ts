import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRoutingModule } from './categoria-routing-module';
import { CategoriaIndex } from './categoria-index/categoria-index';
import { CategoriaDetails } from './categoria-details/categoria-details';

// Angular Material imports
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
//Imports forms
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'; 
import { MatSelectModule } from '@angular/material/select'; 
import { CategoriaAdmin } from './categoria-admin/categoria-admin';
import { CategoriaForm } from './categoria-form/categoria-form';

@NgModule({
  declarations: [
    CategoriaIndex,
    CategoriaDetails,
    CategoriaAdmin,
    CategoriaForm
  ],

  imports: [
    CommonModule,
    CategoriaRoutingModule,
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
export class CategoriaModule { }
