import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  public lancamentosPorCategoria(): Promise<Array<any> | undefined> {
    return this.http.get<Array<any>>(`${this.lancamentosUrl}/estatisticas/por-categoria`)
      .toPromise()
  }

  public lancamentosPorDia(): Promise<Array<any> | undefined> {
    return this.http.get<Array<any>>(`${this.lancamentosUrl}/estatisticas/por-dia`)
      .toPromise()
      .then(response => {
        const dados = response;
        this.converterStringParaData(dados!);
        return dados
      });
  }

  private converterStringParaData(dados: Array<any>) {
    for (const dado of dados) {
      let offset = new Date().getTimezoneOffset() * 60000;

      dado.dia = new Date(dado.dia);
      dado.dia = new Date(new Date(dado.dia).getTime() + offset)
    }
  }

}
