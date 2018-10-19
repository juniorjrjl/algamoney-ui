import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { LancamentoModelo } from '../core/lancamento.modelo';
import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { LancamentoFiltro } from './lancamentoFiltro';
import * as moment from 'moment';

@Injectable()
export class LancamentoService {

  private lancamentoUrl: string;

  constructor(private authHttp: AuthHttp) {
    this.lancamentoUrl = `${environment.apiUrl}/lancamentos`;
  }

  public pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const params = new URLSearchParams()
    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());
    if (filtro.descricao) {
      params.set('descricao', filtro.descricao)
    }
    if (filtro.dataVencimentoInicio) {
      params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }
    if (filtro.dataVencimentoFim) {
      params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }
    return this.authHttp.get(`${this.lancamentoUrl}?resumo`, { search: params })
      .toPromise()
      .then(response => {
          const responseJson = response.json();
          const lancamentos = responseJson.content;
          const resultado = {
            lancamentos: lancamentos,
            total: responseJson.totalElements
          };
          return resultado;
      });
  }

  public excluir(codigo: number): Promise<void> {
    return this.authHttp.delete(`${this.lancamentoUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  public adicionar(lancamento: LancamentoModelo): Promise<LancamentoModelo> {
    return this.authHttp.post(`${this.lancamentoUrl}`, JSON.stringify(lancamento))
      .toPromise()
      .then(response => response.json());
  }

  public atualizar(lancamento: LancamentoModelo): Promise<LancamentoModelo> {
    return this.authHttp.put(`${this.lancamentoUrl}/${lancamento.codigo}`,
        JSON.stringify(lancamento))
      .toPromise()
      .then(response => {
        const lancamentoAlterado = response.json() as LancamentoModelo;

        this.converterStringsParaDatas([lancamentoAlterado]);

        return lancamentoAlterado;
      });
  }

  public buscarPorCodigo(codigo: number): Promise<LancamentoModelo> {
    return this.authHttp.get(`${this.lancamentoUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const lancamento = response.json() as LancamentoModelo;

        this.converterStringsParaDatas([lancamento]);

        return lancamento;
      });
  }

  urlUploadAnexo(): string {
    return `${this.lancamentoUrl}/anexo`;
  }

  private converterStringsParaDatas(lancamentos: LancamentoModelo[]) {
    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento,
        'YYYY-MM-DD').toDate();

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento,
          'YYYY-MM-DD').toDate();
      }
    }
  }

}
