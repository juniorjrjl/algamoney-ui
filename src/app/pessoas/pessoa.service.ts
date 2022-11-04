import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

import { PessoaFiltro } from './pessoaFiltro';
import { PessoaModelo } from '../core/pessoa.modelo';
import { EstadoModelo } from '../core/estadoModelo';
import { CidadeModelo } from '../core/cidadeModelo';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private pessoaUrl: string;
  private cidadeUrl: string;
  private estadoUrl: string;

  constructor(private http: HttpClient) {
    this.pessoaUrl = `${environment.apiUrl}/pessoas`;
    this.cidadeUrl = `${environment.apiUrl}/cidades`;
    this.estadoUrl = `${environment.apiUrl}/estados`;
  }

  public pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });
    if (filtro.nome) {
      params = params.append('nome', filtro.nome)
    }
    return this.http.get<any>(this.pessoaUrl, { params })
      .toPromise()
      .then(response => {
          const pessoas = response.content;
          const resultado = {
            pessoas: pessoas,
            total: response.totalElements
          };
          return resultado;
      });
  }

  listarTodas(): Promise<any> {

    return this.http.get<any>(this.pessoaUrl)
      .toPromise()
      .then(response => response.content);
  }

  public excluir(codigo: number): Promise<void | undefined> {

    return this.http.delete<void>(`${this.pessoaUrl}/${codigo}`)
      .toPromise()
  }

  public  mudarStatus(codigo: number, ativo: boolean): Promise<void | undefined> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    return this.http.put<void>(`${this.pessoaUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
  }

  adicionar(pessoa: PessoaModelo): Promise<PessoaModelo | undefined> {
    return this.http.post<PessoaModelo>(this.pessoaUrl, pessoa)
      .toPromise();
  }

  atualizar(pessoa: PessoaModelo): Promise<PessoaModelo | undefined> {
    return this.http.put<PessoaModelo>(`${this.pessoaUrl}/${pessoa.codigo}`,
        pessoa)
      .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<PessoaModelo | undefined> {
    return this.http.get<PessoaModelo>(`${this.pessoaUrl}/${codigo}`)
      .toPromise();
  }

  listarEstados(): Promise<EstadoModelo[] | undefined> {
    return this.http.get<Array<EstadoModelo>>(`${this.estadoUrl}`)
      .toPromise();
  }

  pesquisarCidades(codigoEstado: number): Promise<EstadoModelo[] | undefined> {
    const params = new HttpParams().append('estado', codigoEstado.toString());
    return this.http.get<Array<CidadeModelo>>(`${this.cidadeUrl}`, { params })
      .toPromise();
  }

}
