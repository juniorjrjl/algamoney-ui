import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { MoneyHttp } from './../seguranca/money.http';
import * as moment from 'moment';
import { environment } from './../../environments/environment';

@Injectable()
export class RelatoriosService {

  private lancamentosUrl: string;

  constructor(private http: MoneyHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  public relatorioLancamentosPorPessoas(inicio: Date, fim: Date) {
    const params = new HttpParams({
      fromObject: {
        inicio: moment(inicio).format('YYYY-MM-DD'),
        fim: moment(fim).format('YYYY-MM-DD')
      }
    });
    return this.http.get(`${this.lancamentosUrl}/relatorios/por-pessoa`, {params, responseType: 'blob'})
      .toPromise();
  }

}
