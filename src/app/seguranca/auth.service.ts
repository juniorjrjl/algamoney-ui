import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map } from 'rxjs';
import { NotAuthenticatedError } from './money-http-interceptors';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokensRevokeUrl = environment.apiUrl + '/tokens/revoke';
  oauthTokenUrl = environment.apiUrl + '/oauth/token'
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.carregarToken();
  }

  login(usuario: string, senha: string): Promise<void> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;
    
    return this.http.post<any>(this.oauthTokenUrl, body, { headers: headers, withCredentials: true })
      .toPromise()
      .then(response => {
        this.armazenarToken(response.access_token)
      })
      .catch(response => {
        if (response.status === 400) {
          if (response.error === 'invalid_grant') {
            return Promise.reject('Usuário e/ou senha inválido!')
          }
        }
        return Promise.reject(response);
      });
  }

  public obterNovoAccessToken(): Promise<void> {
    const body = 'grant_type=refresh_token';
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    return this.http.post<any>(this.oauthTokenUrl, body, {headers: headers, withCredentials: true})
      .toPromise()
      .then(response => {
        this.armazenarToken(response.access_token)
      })
      .catch(error => {

        return Promise.resolve();
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

  public temQualquerPermissao(roles: any) {
    for (const role of roles) {
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

  logout() {
    return this.http.delete(this.tokensRevokeUrl, { withCredentials: true })
      .toPromise()
      .then(() => {
        this.limparAccessToken();
      });
  }

}
