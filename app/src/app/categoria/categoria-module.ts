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

@NgModule({
  declarations: [
    CategoriaIndex,
    CategoriaDetails
  ],

  imports: [
    CommonModule,
    CategoriaRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class CategoriaModule { }
