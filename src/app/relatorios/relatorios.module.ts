import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { RelatorioLancamentosComponent} from './relatorio-lancamentos/relatorio-lancamentos.component'
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RelatoriosRoutingModule,
    CalendarModule
  ],
  declarations: [RelatorioLancamentosComponent]
})
export class RelatoriosModule { }
