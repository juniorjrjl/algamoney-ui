import { Component, ViewChild, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

import { PessoaFiltro } from '../pessoaFiltro';
import { PessoaService } from '../pessoa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';


@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  constructor(
    private pessoaService: PessoaService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private title: Title) {

  }

  ngOnInit(): void {
    this.title.setTitle('Pesquisa de Pessoas');
  }

  totalRegistros = 0;
  pessoas = [];
  filtro = new PessoaFiltro();
  @ViewChild('tabela') tabela: any;

  public pesquisar(pagina = 0): void {
    this.filtro.pagina = pagina;
    this.pessoaService.pesquisar(this.filtro)
    .then(resultado => {
      this.totalRegistros = resultado.total;
      this.pessoas = resultado.pessoas;
    })
    .catch(erro => this.errorHandler.handler(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first! / event.rows!;
    this.pesquisar(pagina)
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        if (this.tabela.first === 0) {
          this.pesquisar();
        } else {
          this.tabela.first = 0;
        }

        this.messageService.add({severity: 'success', detail: 'Pesssoa excluída com sucesso!'});
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

  alternarStatus(pessoa: any): void {
    const novoStatus = pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
        this.messageService.add({severity: 'success', detail: `Pessoa ${acao} com sucesso!`});
      })
      .catch(erro => this.errorHandler.handler(erro));
  }

}
