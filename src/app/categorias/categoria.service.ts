import { MoneyHttp } from './../seguranca/money.http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class CategoriaService {

  private categoriasUrl: string;

  constructor(private http: MoneyHttp) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.categoriasUrl)
      .toPromise()
  }

}
