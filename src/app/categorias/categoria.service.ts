import { AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class CategoriaService {

  categoriasUrl = 'http://localhost:8080/categorias';

  constructor(private authHttp: AuthHttp) { }

  listarTodas(): Promise<any> {
    return this.authHttp.get(this.categoriasUrl)
      .toPromise()
      .then(response => response.json());
  }

}
