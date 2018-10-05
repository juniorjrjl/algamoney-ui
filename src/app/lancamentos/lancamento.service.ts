import { LancamentoModelo } from './../core/lancamentoModelo';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { LancamentoFiltro } from './lancamentoFiltro';
import * as moment from 'moment';

@Injectable()
export class LancamentoService {

  lancamentoUrl = 'http://localhost:8080/lancamentos'

  constructor(private http: Http) { }

  public pesquisar(filtro: LancamentoFiltro): Promise<any> {
    const params = new URLSearchParams()
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
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
    return this.http.get(`${this.lancamentoUrl}?resumo`, {headers : headers, search: params})
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
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    return this.http.delete(`${this.lancamentoUrl}/${codigo}`, {headers : headers})
      .toPromise()
      .then(() => null);
  }

  public adicionar(lancamento: LancamentoModelo): Promise<LancamentoModelo> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.lancamentoUrl}`, JSON.stringify(lancamento), {headers : headers})
      .toPromise()
      .then(response => response.json());
  }

  public atualizar(lancamento: LancamentoModelo): Promise<LancamentoModelo> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    headers.append('Content-Type', 'application/json');

    return this.http.put(`${this.lancamentoUrl}/${lancamento.codigo}`,
        JSON.stringify(lancamento), { headers })
      .toPromise()
      .then(response => {
        const lancamentoAlterado = response.json() as LancamentoModelo;

        this.converterStringsParaDatas([lancamentoAlterado]);

        return lancamentoAlterado;
      });
  }

  public buscarPorCodigo(codigo: number): Promise<LancamentoModelo> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.lancamentoUrl}/${codigo}`, { headers })
      .toPromise()
      .then(response => {
        const lancamento = response.json() as LancamentoModelo;

        this.converterStringsParaDatas([lancamento]);

        return lancamento;
      });
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
