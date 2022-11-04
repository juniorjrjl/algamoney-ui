import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LancamentoModelo } from '../core/lancamento.modelo';
import { LancamentoFiltro } from './lancamentoFiltro';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  private lancamentoUrl: string;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe) {
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
      params = params.set('dataVencimentoDe', this.datePipe.transform(filtro.dataVencimentoInicio, 'yyyy-MM-dd')!);
    }
    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte', this.datePipe.transform(filtro.dataVencimentoFim, 'yyyy-MM-dd')!);
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

  public excluir(codigo: number): Promise<void | undefined> {
    return this.http.delete<void>(`${this.lancamentoUrl}/${codigo}`)
      .toPromise()
  }

  public adicionar(lancamento: LancamentoModelo): Promise<LancamentoModelo | undefined> {
    return this.http.post<LancamentoModelo>(`${this.lancamentoUrl}`, lancamento)
      .toPromise();
  }

  public atualizar(lancamento: LancamentoModelo): Promise<LancamentoModelo> {
    return this.http.put<any>(`${this.lancamentoUrl}/${lancamento.codigo}`,
        lancamento)
      .toPromise()
      .then(response => {
        this.converterStringsParaDatas([response]);
        return response;
      });
  }

  public buscarPorCodigo(codigo: number): Promise<LancamentoModelo | undefined> {
    return this.http.get<LancamentoModelo>(`${this.lancamentoUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        this.converterStringsParaDatas([response!]);
        return response;
      });
  }

  urlUploadAnexo(): string {
    return `${this.lancamentoUrl}/anexo`;
  }

  uploadHeaders() {
    return new HttpHeaders()
      .append('Authorization', 'Bearer ' + localStorage.getItem('token'))
  }

  private converterStringsParaDatas(lancamentos: LancamentoModelo[]) {
    for (const lancamento of lancamentos) {
      let offset = new Date().getTimezoneOffset() * 60000;
      lancamento.dataVencimento = new Date(new Date(lancamento.dataVencimento!).getTime() + offset);

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = new Date(new Date(lancamento.dataPagamento).getTime() + offset);
      }
    }
  }

}
