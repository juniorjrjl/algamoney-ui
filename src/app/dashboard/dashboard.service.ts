import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

import 'rxjs/operator/toPromise';
import * as moment from 'moment';
import { MoneyHttp } from './../seguranca/money.http';

@Injectable()
export class DashboardService {

  private lancamentosUrl: string;

  constructor(private http: MoneyHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  public lancamentosPorCategoria(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.lancamentosUrl}/estatisticas/por-categoria`)
      .toPromise()
  }

  public lancamentosPorDia(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.lancamentosUrl}/estatisticas/por-dia`)
      .toPromise()
      .then(response => {
        const dados = response;
        this.converterStringParaData(dados);
        return dados
      });
  }

  private converterStringParaData(dados: Array<any>) {
    for (const dado of dados) {
      dado.dia = moment(dado.dia, 'YYYY-MM-DD').toDate();
    }
  }

}
