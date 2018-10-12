import { environment } from 'environments/environment';
import { JwtHelper } from 'angular2-jwt';
import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise'
import { PromiseObservable } from 'rxjs/observable/PromiseObservable';

@Injectable()
export class AuthService {

  private oauthTokenURL: string;
  public jwtPayload: any;

  constructor(
    private http: Http,
    private jwtHelper: JwtHelper
  ) {
    this.oauthTokenURL = `${environment.apiUrl}/oauth/token`;
    this.carregarToken();
  }

  login(usuario: string, senha: string): Promise<void> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenURL, body, { headers: headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(response.json().access_token)
      })
      .catch(response => {
        console.log(response)
        if (response.status === 400) {
          const responseJson = response.json();
          if (responseJson.error === 'invalid_grant') {
            return Promise.reject('Usuário e/ou senha inválido!')
          }
        }
        return Promise.reject(response);
      });
  }

  public obterNovoAccessToken(): Promise<void> {
    const body = 'grant_type=refresh_token';
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    return this.http.post(this.oauthTokenURL, body, {headers: headers, withCredentials: true})
      .toPromise()
      .then(response => {
        this.armazenarToken(response.json().access_token)
      })
      .catch(error => {
        return Promise.resolve(null);
      });
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  public temPermissao(permissao: string): boolean {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao)
  }

  public temQualquerPermissao(roles) {
    for (const role of roles){
      if (this.temPermissao(role)) {
        return true;
      }
    }
    return false;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.armazenarToken(token);
    }
  }

}
