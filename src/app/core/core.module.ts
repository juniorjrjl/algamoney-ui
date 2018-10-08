import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CategoriaService } from './../categorias/categoria.service';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import {JwtHelper} from 'angular2-jwt';
import { NavbarComponent } from './navbar/navbar.component';
import { ErrorHandlerService } from './error-handler.service';
import { ToastyModule} from 'ng2-toasty';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { LancamentoService } from '../lancamentos/lancamento.service';
import { PessoaService } from '../pessoas/pessoa.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { AuthService } from './../seguranca/auth.service';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,

    ToastyModule.forRoot(),
    ConfirmDialogModule,
  ],
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent
  ],
  exports: [
    NavbarComponent,
    ToastyModule,
    ConfirmDialogModule
  ],
  providers: [
    LancamentoService,
    PessoaService,
    CategoriaService,
    ConfirmationService,
    Title,
    JwtHelper,
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    ErrorHandlerService,
    AuthService
  ]
})
export class CoreModule { }
