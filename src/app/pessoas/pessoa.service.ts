import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { PessoaFiltro } from './pessoaFiltro';
import { PessoaModelo } from '../core/PessoaModelo';

@Injectable()
export class PessoaService {

  pessoaUrl = 'http://localhost:8080/pessoas'

  constructor(private http: Http) { }

  public pesquisar(filtro: PessoaFiltro): Promise<any> {
    const params = new URLSearchParams()
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());
    if (filtro.nome) {
      params.set('nome', filtro.nome)
    }
    return this.http.get(this.pessoaUrl, {headers : headers, search: params})
      .toPromise()
      .then(response => {
          const responseJson = response.json();
          const pessoas = responseJson.content;
          const resultado = {
            pessoas: pessoas,
            total: responseJson.totalElements
          };
          return resultado;
      });
  }

  listarTodas(): Promise<any> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(this.pessoaUrl, { headers })
      .toPromise()
      .then(response => response.json().content);
  }

  public excluir(codigo: number): Promise<void> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.delete(`${this.pessoaUrl}/${codigo}`, { headers })
      .toPromise()
      .then(() => null);
  }

  public  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    headers.append('Content-Type', 'application/json');

    return this.http.put(`${this.pessoaUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: PessoaModelo): Promise<PessoaModelo> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.pessoaUrl, JSON.stringify(pessoa), { headers })
      .toPromise()
      .then(response => response.json());
  }

  atualizar(pessoa: PessoaModelo): Promise<PessoaModelo> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    headers.append('Content-Type', 'application/json');

    return this.http.put(`${this.pessoaUrl}/${pessoa.codigo}`,
        JSON.stringify(pessoa), { headers })
      .toPromise()
      .then(response => response.json() as PessoaModelo);
  }

  buscarPorCodigo(codigo: number): Promise<PessoaModelo> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.pessoaUrl}/${codigo}`, { headers })
      .toPromise()
      .then(response => response.json() as PessoaModelo);
  }

}
