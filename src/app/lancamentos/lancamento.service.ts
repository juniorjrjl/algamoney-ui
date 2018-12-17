import { MoneyHttp } from './../seguranca/money.http';
import { environment } from 'environments/environment';
import { LancamentoModelo } from '../core/lancamento.modelo';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { LancamentoFiltro } from './lancamentoFiltro';
import * as moment from 'moment';

@Injectable()
export class LancamentoService {

  private lancamentoUrl: string;

  constructor(private http: MoneyHttp) {
    this.lancamentoUrl = `${environment.apiUrl}/lancamentos`;
  }

  public pesquisar(filtro: LancamentoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });
    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao)
    }
    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe', moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }
    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte', moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }
    return this.http.get<any>(`${this.lancamentoUrl}?resumo`, { params })
      .toPromise()
      .then(response => {
          const lancamentos = response.content;
          const resultado = {
            lancamentos: lancamentos,
            total: response.totalElements
          };
          return resultado;
      });
  }

  public excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.lancamentoUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  public adicionar(lancamento: LancamentoModelo): Promise<LancamentoModelo> {
    return this.http.post<LancamentoModelo>(`${this.lancamentoUrl}`, lancamento)
      .toPromise();
  }

  public atualizar(lancamento: LancamentoModelo): Promise<LancamentoModelo> {
    return this.http.put<any>(`${this.lancamentoUrl}/${lancamento.codigo}`,
        lancamento)
      .toPromise()
      .then(response => {
        const lancamentoAlterado = response;
        this.converterStringsParaDatas([lancamentoAlterado]);
        //TODO: crair um dto para receber um objeto sem esses campos
        delete lancamentoAlterado.pessoa.ativo;
        delete lancamentoAlterado.pessoa.endereco;
        //TODO: crair um dto para receber um objeto sem esses campos
        return lancamentoAlterado;
      });
  }

  public buscarPorCodigo(codigo: number): Promise<LancamentoModelo> {
    return this.http.get<LancamentoModelo>(`${this.lancamentoUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const lancamento = response;

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
