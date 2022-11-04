import { NaoAutorizadoComponent } from './nao-autorizado/nao-autorizado.component';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';

import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { AuthService } from './../seguranca/auth.service';
import { ErrorHandlerService } from './error-handler.service';
import { NavbarComponent } from './navbar/navbar.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

registerLocaleData(localePt, 'pt-BR');

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    ToastModule,
    ConfirmDialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    NaoAutorizadoComponent
  ],
  exports: [
    NavbarComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [
    DatePipe,
    ErrorHandlerService,
    AuthService,

    MessageService,
    ConfirmationService,
    Title,
    TranslateService
  ]
})
export class CoreModule { }
