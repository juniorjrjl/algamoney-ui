import { environment } from './../../environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class CategoriaService {

  private categoriasUrl: string;

  constructor(private authHttp: AuthHttp) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;
  }

  listarTodas(): Promise<any> {
    return this.authHttp.get(this.categoriasUrl)
      .toPromise()
      .then(response => response.json());
  }

}
