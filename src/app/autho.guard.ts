import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthoGuard implements CanActivate {

  constructor(public authService : AuthServiceService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const isAuth = this.authService.getTokenStatus();

      if(!isAuth) {
        this.router.navigate(['/login']);
      }

      return isAuth;
  }

}

//Add this in the routing.js
// providers: [AuthoGuard]
