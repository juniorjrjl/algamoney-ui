import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise'

@Injectable()
export class AuthService {

  private oauthTokenURL = 'localhost:8080/oauth/token';

  constructor(
    private http: Http
  ) { }

  public login(usuario: string, senha: string): Promise<void> {
    const body = `username=${usuario}&password${senha}$grant_type=password`;
    const headers = new Headers();
    headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    return this.http.post(this.oauthTokenURL, body, { headers: headers })
    .toPromise()
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }

}
