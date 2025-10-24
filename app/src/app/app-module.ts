import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { ShareModule } from './share/share-module';
import { HomeModule } from './home/home-module';
import { CategoriaModule } from './categoria/categoria-module';
import { TecnicoModule } from './tecnico/tecnico-module';
import { TicketModule } from './ticket/ticket-module';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    CoreModule,
    ShareModule,
    HomeModule,
    CategoriaModule,
    TecnicoModule,
    TicketModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
  ],
  bootstrap: [App]
})
export class AppModule { }
