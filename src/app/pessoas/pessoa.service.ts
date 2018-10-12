import { environment } from 'environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { PessoaFiltro } from './pessoaFiltro';
import { PessoaModelo } from '../core/pessoa.modelo';

@Injectable()
export class PessoaService {

  private pessoaUrl: string;

  constructor(private authHttp: AuthHttp) {
    this.pessoaUrl = `${environment.apiUrl}/pessoas`;
  }

  public pesquisar(filtro: PessoaFiltro): Promise<any> {
    const params = new URLSearchParams()
    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());
    if (filtro.nome) {
      params.set('nome', filtro.nome)
    }
    return this.authHttp.get(this.pessoaUrl, {search: params})
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

    return this.authHttp.get(this.pessoaUrl)
      .toPromise()
      .then(response => response.json().content);
  }

  public excluir(codigo: number): Promise<void> {

    return this.authHttp.delete(`${this.pessoaUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  public  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    return this.authHttp.put(`${this.pessoaUrl}/${codigo}/ativo`, ativo)
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: PessoaModelo): Promise<PessoaModelo> {
    return this.authHttp.post(this.pessoaUrl, JSON.stringify(pessoa))
      .toPromise()
      .then(response => response.json());
  }

  atualizar(pessoa: PessoaModelo): Promise<PessoaModelo> {
    return this.authHttp.put(`${this.pessoaUrl}/${pessoa.codigo}`,
        JSON.stringify(pessoa))
      .toPromise()
      .then(response => response.json() as PessoaModelo);
  }

  buscarPorCodigo(codigo: number): Promise<PessoaModelo> {
    return this.authHttp.get(`${this.pessoaUrl}/${codigo}`)
      .toPromise()
      .then(response => response.json() as PessoaModelo);
  }

}
