import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';

import { ToastyService } from 'ng2-toasty';
import { LancamentoFiltro } from './../lancamentoFiltro';
import { LancamentoService } from './../lancamento.service';
import { ErrorHandlerService } from './../../core/error-handler.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  totalregistros = 0;
  lancamentos = [];
  filtro = new LancamentoFiltro();
  @ViewChild('tabela') tabela;

  ngOnInit(): void {
  }

  public pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalregistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      })
      .catch(error => this.errorHandler.handler(error));
  }

  confirmarExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        if (this.tabela.first === 0) {
          this.pesquisar();
        } else {
          this.tabela.first = 0;
        }
        this.toastyService.success('Lançamento excluído com sucesso!');
      })
      .catch(error => this.errorHandler.handler(error));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina)
  }

  constructor(
    private lancamentoService: LancamentoService,
    private toastyService: ToastyService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService) {

  }

}
