import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { Observable } from "rxjs";
import { Roles } from "../../shared/models/constant/roles.model";
import { SessionInfoService } from "./sessionInfo.service";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService, private session: SessionInfoService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (this.authService.authenticated) {
      return true;
    } else {
      let role = route.data["roles"];

      const cid = route.queryParamMap.get('w1');
      const sid = route.queryParamMap.get('w2');
      const nn = route.queryParamMap.get('w3');

      if (cid && sid && nn) {
        return this.authService.openWeb(role, cid, sid, nn)
          .pipe(map(res => {
            if (res) {
              return true;
            }
            else {
              this.backToLogin(role, state);
              return false;
            }
          }));
      }
      else if (this.session.tenTruyNhap && this.session.clientId && this.session.refreshToken) {
        return this.authService.checkLogin()
          .pipe(map(res => {
            if (res) {
              return true;
            }
            else {
              this.backToLogin(role, state);
              return false;
            }
          }));
      }
      else {
        this.backToLogin(role, state);
        return false;
      }
    }
  }

  private backToLogin(role: string, state: RouterStateSnapshot) {
    if (state.url) this.authService.callbackUrl = state.url;
    if (role === Roles.Admin) this.router.navigateByUrl("/dang-nhap-admin");
    else this.router.navigateByUrl("/dang-nhap");
  }
}
