import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';
import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { InputTextareaModule } from 'primeng/components/inputtextarea/inputtextarea';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { ButtonModule } from 'primeng/components/button/button';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { SelectButtonModule } from 'primeng/components/selectbutton/selectbutton';
import { SharedModule } from './../shared/shared.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SharedModule,
    DataTableModule,
    TooltipModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    SelectButtonModule,
    CalendarModule,
    CurrencyMaskModule
  ],
  declarations: [
    LancamentoCadastroComponent,
    LancamentosPesquisaComponent
  ],
  exports: [
    LancamentoCadastroComponent,
    LancamentosPesquisaComponent
  ]
})
export class LancamentosModule { }
