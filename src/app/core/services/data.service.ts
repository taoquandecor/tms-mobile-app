import { Observable, from, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Roles } from "../../shared/models/constant/roles.model";
import { TAlertService } from "../../shared/services/talert.service";
import { ParamsService } from "./params.service";
import { SessionInfoService } from "./sessionInfo.service";

@Injectable()
export class DataService {
  constructor(private http: HttpClient, private params: ParamsService, private session: SessionInfoService, private talert: TAlertService, private router: Router) { }

  private reconnecting: boolean = false;
  private reconnectedResult: boolean = false;

  public getRequest(url: string, auth: boolean = true, showError = true): Observable<any> {
    return this.httpget(url, auth, auth, showError);
  }

  public postRequest(url: string, body: any, auth: boolean = true, showError = true): Observable<any> {
    return this.httppost(url, body, auth, auth, showError);
  }

  private httpget(url: string, auth: boolean = true, reconnect: boolean = true, showError = true): Observable<any> {
    let options = this.getOptions(auth);
    return this.http.get(this.getUrl(url), options).pipe(
      catchError(errorResponse => {
        let ob = from(this.handleError(errorResponse, reconnect, showError));
        let mo = ob.pipe(mergeMap(res => {
          if (res) {
            return res.pipe(map(res2 => res2))
          }

          return of(false);
        }));

        let mo2 = mo.pipe(mergeMap(res => {
          if (res) {
            return this.httpget(url, auth, showError, false).pipe(map(res2 => res2));
          }

          return of(undefined);
        }));

        return mo2;
      })
    );
  }

  private httppost(url: string, body: any, auth: boolean = true, reconnect: boolean = true, showError = true): Observable<any> {
    let options = this.getOptions(auth);
    return this.http.post(this.getUrl(url), body, options).pipe(
      catchError(errorResponse => {
        let ob = from(this.handleError(errorResponse, reconnect, showError));
        let mo = ob.pipe(mergeMap(res => {
          if (res) {
            return res.pipe(map(res2 => res2))
          }

          return of(false);
        }));

        let mo2 = mo.pipe(mergeMap(res => {
          if (res) {
            return this.httppost(url, body, auth, showError, false).pipe(map(res2 => res2));
          }

          return of(undefined);
        }));

        return mo2;
      })
    );
  }

  private getOptions(auth: boolean) {
    if (auth) {
      let authToken = this.session.jwtToken;
      let headers = new HttpHeaders();

      return { headers: headers.set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + authToken) };
    }

    return undefined;
  }

  private getUrl(api: string) {
    const u1 = this.params.baseApiUrl.endsWith("/") ? this.params.baseApiUrl.substr(0, this.params.baseApiUrl.length - 1) : this.params.baseApiUrl;
    const u2 = (api.startsWith("/") ? api : "/" + api);
    return u1 + u2;
  }

  private async waitForReconnecting() {
    while (this.reconnecting) {
      await new Promise<void>(resolve => {
        setTimeout(resolve, 100);
      });
    }
  }

  // Return:
  // - of(true): Gọi lại
  // - of(false): Bỏ qua
  private async handleError(errorResponse: any, reconnect: boolean = true, showError = true): Promise<Observable<boolean>> {
    if (this.params.clearConsole) {
      console.clear();
    }

    if (errorResponse.status === 401) {
      if (reconnect && this.session.refreshToken) {
        if (this.reconnecting) {
          await this.waitForReconnecting();
          return of(this.reconnectedResult);
        }
        else {
          this.reconnecting = true;
          this.reconnectedResult = false;
          return this.refreshToken().pipe(map(res => {
            this.reconnectedResult = res;
            this.reconnecting = false;

            if (res) {
              return true;
            }
            else {
              if (this.session.userRole === Roles.Admin) this.router.navigateByUrl("/dang-nhap-admin");
              else this.router.navigateByUrl("/dang-nhap");
              return false;
            }
          }));
        }
      }
      else {
        if (this.session.userRole === Roles.Admin) this.router.navigateByUrl("/dang-nhap-admin");
        else this.router.navigateByUrl("/dang-nhap");
        return of(false);
      }
    }
    else {
      if (showError) {
        this.showError(errorResponse);
      }

      return of(false);
    }
  }

  private showError(errorResponse: any) {
    if (errorResponse) {
      if (errorResponse.error) {
        if (errorResponse.error.Message === "QUYEN") {
          this.talert.showError("Truy nhập không hợp lệ!");
        }
        else if (errorResponse.status === 424) {
          this.talert.showError(errorResponse.error.Message);
        }
      }

      this.talert.showError(errorResponse.statusText || "Network Error!");
    }
    else this.talert.showError("Network Error!");
  }

  url(url: string, params: UrlParams[] | undefined = undefined): string {
    let ps = "";

    if (params) {
      for (let p of params) {
        if (p && p.name) {
          if (ps.length == 0) ps = p.name + "=";
          else ps += "&" + p.name + "=";

          if (p.value !== null && p.value !== undefined && p.value !== NaN) ps += p.value;
        }
      }
    }

    let res = url;
    if (ps.length > 0) {
      if (res.indexOf("?") < 0) res += "?" + ps;
      else {
        if (res.endsWith("?")) res += ps;
        else res += "&" + ps;
      }
    }

    return res;
  }

  private refreshToken(): Observable<boolean> {
    return this.postRequest(this.url("/api/login/refresh-token",
      [
        new UrlParams("clientId", this.session.clientId),
        new UrlParams("token", this.session.refreshToken),
        new UrlParams("maNgonNgu", this.session.maNgonNgu),
      ]), undefined, false, false)
      .pipe(map(res => {
        if (res && res.success) {
          this.session.jwtToken = res.jwt;
          this.session.refreshToken = res.refreshToken;
          this.session.maNsd = res.maNsd;
          this.session.tenTruyNhap = res.tenTruyNhap;
          this.session.email = res.email;
          this.session.tenCanBo = res.tenCanBo;
          this.session.maCanBo = res.maCanBo;
          this.session.isAdmin = res.isAdmin;

          return true;
        }

        return false;
      }), catchError(() => {
        return of(false)
      }))
  }
}

export class UrlParams {
  constructor(name: string, value: any = undefined) {
    this.name = name;
    this.value = value;
  }

  name: string;
  value: any | null;
}
