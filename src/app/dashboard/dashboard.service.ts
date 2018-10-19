import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

import { AuthHttp } from 'angular2-jwt';
import 'rxjs/operator/toPromise';
import * as moment from 'moment';

@Injectable()
export class DashboardService {

  private lancamentosUrl: string;

  constructor(private authHttp: AuthHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  public lancamentosPorCategoria(): Promise<Array<any>> {
    return this.authHttp.get(`${this.lancamentosUrl}/estatisticas/por-categoria`)
      .toPromise()
      .then(response => response.json());
  }

  public lancamentosPorDia(): Promise<Array<any>> {
    return this.authHttp.get(`${this.lancamentosUrl}/estatisticas/por-dia`)
      .toPromise()
      .then(response => {
        const dados = response.json();
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
