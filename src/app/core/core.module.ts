import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CategoriaService } from './../categorias/categoria.service';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import {JwtHelper} from 'angular2-jwt';
import { NavbarComponent } from './navbar/navbar.component';
import { ErrorHandlerService } from './error-handler.service';
import { ToastyModule} from 'ng2-toasty';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LancamentoService } from '../lancamentos/lancamento.service';
import { PessoaService } from '../pessoas/pessoa.service';
import { ConfirmationService } from 'primeng/api';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { AuthService } from './../seguranca/auth.service';
import { NaoAutorizadoComponent } from './nao-autorizado/nao-autorizado.component';

registerLocaleData(localePt);

@NgModule({
  imports: [
    RouterModule,
    CommonModule,

    ToastyModule.forRoot(),
    ConfirmDialogModule,
  ],
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    NaoAutorizadoComponent
  ],
  exports: [
    NavbarComponent,
    ToastyModule,
    ConfirmDialogModule,
    NaoAutorizadoComponent
  ],
  providers: [
    LancamentoService,
    PessoaService,
    CategoriaService,
    ConfirmationService,
    Title,
    JwtHelper,
    {provide: LOCALE_ID, useValue: 'pt'},
    ErrorHandlerService,
    AuthService
  ]
})
export class CoreModule { }
