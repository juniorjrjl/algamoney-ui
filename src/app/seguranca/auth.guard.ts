import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authService.isAccessTokenInvalido()) {
        return this.authService.obterNovoAccessToken()
          .then(() => {
            if (this.authService.isAccessTokenInvalido()) {
              this.router.navigate(['/login']);
              return false;
            }
            return this.podeAcessarRota(next.data?.['roles'])
          });
        }
      return this.podeAcessarRota(next.data?.['roles'])
  }

  podeAcessarRota(roles: string[]): boolean{
    if (roles && !this.authService.temQualquerPermissao(roles)){
      this.router.navigate(['/nao-autorizado'])
      return false
    }
    return true;
  }

}
