import { ButtonModule } from 'primeng/components/button/button';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { InputMaskModule } from 'primeng/components/inputmask/inputmask';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoasGridComponent } from './pessoas-grid/pessoas-grid.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputMaskModule,
    DataTableModule,
    TooltipModule,
    InputSwitchModule,
    ButtonModule
  ],
  exports: [
    PessoaCadastroComponent,
    PessoasPesquisaComponent
  ],
  declarations: [
    PessoaCadastroComponent,
    PessoasPesquisaComponent,
    PessoasGridComponent
  ]
})
export class PessoasModule { }
