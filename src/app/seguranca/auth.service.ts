import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl = environment.apiUrl + '/oauth2/token'
  oauthAuthorizeUri = environment.apiUrl + '/oauth2/authorize'
  jwtPayload: any

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.carregarToken();
  }

  login(){
    const state = this.gerarStringAleatoria(40)
    const codeVerifier = this.gerarStringAleatoria(128)
    localStorage.setItem('state', state)
    localStorage.setItem('codeVerifier', codeVerifier)

    const challengeMethod = 'S256'
    const codeChallenge = CryptoJS.SHA256(codeVerifier)
      .toString(CryptoJS.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    const redirectURI = encodeURIComponent(environment.oauthCallbackUrl)
    const clientId = 'angular'
    const scope = 'read write'
    const responseType = 'code'
    const params = [
      `response_type=${responseType}`, 
      `client_id=${clientId}`, 
      `scope=${scope}`, 
      `code_challenge=${codeChallenge}`, 
      `code_challenge_method=${challengeMethod}`,
      `state=${state}`,
      `redirect_uri=${redirectURI}` 
    ]
    window.location.href = `${this.oauthAuthorizeUri}?${params.join('&')}`
  }

  obterNovoAccessTokenComCode(code: string, state: string): Promise<any> {
    const stateSalvo = localStorage.getItem('state')
    if (stateSalvo !== state){
      return Promise.reject(null)
    }

    const codeVerifier = localStorage.getItem('codeVerifier')!

    const payload = new HttpParams()
      .append('grant_type', 'authorization_code')
      .append('code', code)
      .append('redirect_uri', environment.oauthCallbackUrl)
      .append('code_verifier', codeVerifier)

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');
      
      return this.http.post<any>(this.oauthTokenUrl, payload, { headers })
        .toPromise()
        .then(response => {
          this.armazenarAccessToken(response['access_token'])
          this.armazenarRefreshToken(response['refresh_token'])
          localStorage.removeItem('state')
          localStorage.removeItem('codeVerifier')
          return Promise.resolve(null)
        })
        .catch(respone => Promise.resolve())
  }

  public obterNovoAccessToken(): Promise<void> {
    let headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    const payload = new HttpParams()
      .append('grant_type', 'refresh_token')
      .append('refresh_token', localStorage.getItem('refreshToken')!)

    return this.http.post<any>(this.oauthTokenUrl, payload, 
      { headers: headers })
      .toPromise()
      .then(response => {
        this.armazenarAccessToken(response['access_token'])
        this.armazenarRefreshToken(response['refresh_token'])
      })
      .catch(error => Promise.resolve());
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

  logout() {
    this.limparAccessToken()
    localStorage.clear()
    window.location.href = `${environment.apiUrl}/logout?returnTo=${environment.logoutRedirectTo}`
  }

  private armazenarAccessToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private armazenarRefreshToken(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.armazenarAccessToken(token);
    }
  }

  private gerarStringAleatoria(tamanho: number) {
    let resultado = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < tamanho; i++) {
      resultado += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return resultado;
}

}
