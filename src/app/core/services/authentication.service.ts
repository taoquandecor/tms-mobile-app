import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DataOutput } from "../../shared/models/common/data-output.model";
import { Roles } from "../../shared/models/constant/roles.model";
import { TAlertService } from "../../shared/services/talert.service";
import { CryptographyService } from "./cryptography.service";
import { DataService, UrlParams } from "./data.service";
import { SessionInfoService } from "./sessionInfo.service";

@Injectable()
export class AuthenticationService {
  constructor(private router: Router, private crypto: CryptographyService, private dataService: DataService, private session: SessionInfoService, private talert: TAlertService) { }

  private authenticated_p: boolean = false;
  public get authenticated(): boolean {
    if (this.authenticated_p) return true;
    else return false;
  }

  public callbackUrl: string | undefined;
  public tenTruyNhap: string | undefined;
  public matKhau: string | undefined;

  public anh: string | undefined;
  public tenFileAnh: string | undefined;

  public login(role: string = Roles.User, maNgoNgu: string = "vn"): Observable<boolean | {}> {
    this.session.jwtToken = undefined;

    let err = "Tên truy nhập hoặc mật khẩu không hợp lệ.";
    return this.dataService.getRequest(this.dataService.url("/api/login/lay-random-string", [new UrlParams("clientId", this.session.clientId)]), false, false)
      .pipe(mergeMap(response => {
        this.session.clientId = response['clientId'];
        const pass = this.crypto.encryptRsa(this.crypto.sha256(this.matKhau), response['randomString']);
        return this.dataService.postRequest(this.dataService.url("/api/login/dang-nhap"),
          {
            clientId: response['clientId'],
            sessionId: response['sessionId'],
            tenTruyNhapOrEmail: this.tenTruyNhap,
            matKhau: pass,
            maNgonNgu: maNgoNgu
          },
          false,
          false).pipe(
            map((response: any) => {
              if (response) {
                if (response.success && response.jwt) {
                  this.matKhau = '';
                  this.session.jwtToken = response.jwt;
                  this.session.refreshToken = response.refreshToken;
                  this.session.maNsd = response.maNsd;
                  this.session.tenTruyNhap = response.tenTruyNhap;
                  this.session.email = response.email;
                  this.session.tenCanBo = response.tenCanBo;
                  this.session.maCanBo = response.maCanBo;
                  this.session.isAdmin = response.isAdmin;

                  if (!this.session.maCanBo) {
                    this.talert.showWarning("Chưa có hồ sơ nhân sự đi kèm với tài khoản hiện tại. Bạn có thể không sử dụng được một số chức năng.");
                  }

                  // if (role === Roles.User && response.needKhoiTao) {
                  //   this.router.navigate(['form', "khoi-tao", "khoi-tao-du-lieu"]);
                  // }
                  // else {
                  //   this.navCallbackUrl(role);
                  // }
                  this.navCallbackUrl(role);

                  this.authenticated_p = true;
                  return true;
                }
                else if (response.trangThai === "D") {
                  this.talert.showError("Tài khoản của bạn đã bị khóa.")
                  return false;
                }
                else if (response.soLanDangNhapThatBai) {
                  this.talert.showError("Bạn đã đăng nhập không thành công vượt quá số lần tối đa.")
                  return false;
                }
                else {
                  this.talert.showError(err)
                  return false;
                }
              }
              else {
                this.talert.showError(err)
                return false;
              }
            }),
            catchError(e => {
              this.talert.showError(err)
              return of(false);
            }))
      }),
        catchError(e => {
          this.talert.showError(err)
          return of(false);
        }));
  }

  // Phục vụ refresh hoặc nhập địa chỉ
  public checkLogin(): Observable<boolean> {
    if (this.authenticated_p) {
      return of(true);
    }
    else {
      if (this.session.tenTruyNhap && this.session.clientId && this.session.refreshToken) {
        return this.dataService.getRequest(this.dataService.url("/api/login/check"))
          .pipe(map((res: boolean) => {
            if (res) {
              this.authenticated_p = true;
            }
            return res;
          }));
      }
    }

    return of(false);
  }

  private navCallbackUrl(role: string) {
    if (this.callbackUrl) {
      this.router.navigateByUrl(this.callbackUrl);
    }
    else {
      if (role === Roles.Admin) {
        this.router.navigate(['admin']);
      }
      else this.router.navigate(['form']);
    }
  }

  public logout(role: string | undefined = undefined) {
    return this.dataService.postRequest(this.dataService.url("/api/login/thoat"), '"' + this.session.clientId + '"')
      .subscribe(respone => {
        this.clearClientSession(role);
      });
  }

  public doiMatKhau(oldPassword: string | undefined, newPassword: string | undefined) {
    return this.dataService.getRequest(this.dataService.url("/api/nsd/lay-random-string"))
      .pipe(mergeMap(response => {
        let k = response['randomString'];
        let opass = this.crypto.encryptRsa(this.crypto.sha256(oldPassword), k);
        let npass = this.crypto.encryptRsa(this.crypto.sha256(newPassword), k);

        return this.dataService.postRequest(this.dataService.url("/api/nsd/doi-mat-khau"), { oldPassword: opass, newPassword: npass }, true).pipe(
          map((response: DataOutput) => {
            if (response) {
              if (response.success) {
                this.talert.showSuccess("Mật khẩu đã được thay đổi thành công.");
                this.navCallbackUrl(Roles.User);
                return { ok: true, msg: true };
              }
              else if (response.message) {
                this.talert.showError(response.message);
                return { ok: false, msg: true };
              }
            }

            return { ok: false, msg: true };
          }),
          catchError(e => { return of({ ok: false, msg: false }); }))
      }));
  }

  public laySessionInfo(role: string | undefined = undefined) {
    this.dataService.getRequest(this.dataService.url("/api/session/lay-session-info"))
      .subscribe((res: any) => {
        if (res) {
          this.tenTruyNhap = res.tenTruyNhap;
        }
        else {
          this.clearClientSession(role);
        }
      }, () => {
        this.clearClientSession(role);
      });
  }

  private clearClientSession(role: string | undefined) {
    this.authenticated_p = false;
    this.session.clear();
    if (role === Roles.Admin) this.router.navigateByUrl("/dang-nhap-admin");
    else this.router.navigateByUrl("/dang-nhap");
  }

  public checkExists(tenTruyNhaporEmail: string) {
    return this.dataService.getRequest(this.dataService.url("/api/dang-nhap/kiem-tra-tai-khoan", [new UrlParams("tenTruyNhapOrEmail", tenTruyNhaporEmail)])).pipe(
      map((response: DataOutput) => {
        if (response && response.dataOutputs) {
          let tt = response.dataOutputs.find(f => f.changedColumn === "#TrangThai");
          if (tt) {
            return { success: true, trangThai: tt.changedValue };
          }
        }
        return { success: false };
      }), catchError(e => { return of({ success: false, trangThai: undefined }) }));
  }

  public getResetPasswordUrl(tenTruyNhaporEmail: string) {
    return this.dataService.postRequest(this.dataService.url("/api/dang-nhap/lay-lai-mat-khau",
      [
        new UrlParams("tenTruyNhapOrEmail", tenTruyNhaporEmail),
        new UrlParams("url", window.location.origin + "/thiet-lap-mat-khau")
      ]), {}, false).pipe(
        map((response: DataOutput) => {
          if (response && response.dataOutputs) {
            let ttn = response.dataOutputs.find(f => f.changedColumn === "#TenTruyNhap" && f.changedValue === false);
            if (ttn) {
              this.talert.showError("Không tìm thấy tài khoản.");
              return false;
            }

            let tt = response.dataOutputs.find(f => f.changedColumn === "#TrangThai" && f.changedValue === "D");
            if (tt) {
              this.talert.showError("Tài khoản đã bị khóa.");
              return false;
            }

            let email = response.dataOutputs.find(f => f.changedColumn === "#SendEmail" && f.changedValue === false);
            if (email) {
              this.talert.showError("Không gửi được email. Xin hãy liên hệ với quản trị hệ thống.");
              return false;
            }

            this.router.navigateByUrl("/dang-nhap");
            this.talert.showSuccess("Xin hãy kiểm tra email để thực hiện thiết lập lại mật khẩu.");
            return true;
          }

          return false;
        }), catchError(e => { return of(false) }));
  }

  public layAvatar() {
    this.dataService.getRequest(this.dataService.url("/api/ho-so/lay-anh"))
      .subscribe(response => {
        if (response) {
          this.anh = response[0].noiDungNen;
          this.tenFileAnh = response[0].tenFile;
        }
      });
  }

  public initOpenWeb() {
    return this.dataService.postRequest(this.dataService.url('/api/login/i-open-web'), undefined);
  }

  public openWeb(role: string, clientId: string, sessionId: string, maNgonNgu: string) {
    return this.dataService.getRequest(this.dataService.url('/api/login/open-web',
      [
        new UrlParams('clientId', clientId),
        new UrlParams('sessionId', sessionId),
        new UrlParams('maNgonNgu', maNgonNgu)
      ])).pipe(map((res: any) => {
        if (res && res.success && res.jwt) {
          this.session.jwtToken = res.jwt;
          this.session.refreshToken = res.refreshToken;
          this.session.maNsd = res.maNsd;
          this.session.tenTruyNhap = res.tenTruyNhap;
          this.session.email = res.email;
          this.session.tenCanBo = res.tenCanBo;
          this.session.maCanBo = res.maCanBo;
          this.session.isAdmin = res.isAdmin;

          if (!this.session.clientId) {
            this.session.clientId = clientId;
          }

          this.navCallbackUrl(role);

          this.authenticated_p = true;
          return true;
        }
        else if (res.trangThai === "D") {
          this.talert.showError("Tài khoản hiện tại đã bị khóa.")
          return false;
        }
        else {
          this.talert.showError('Không thể kiểm tra được thông tin người dùng.')
          return false;
        }
      }),
        catchError(e => {
          this.talert.showError('Không thể mở được từ ứng dụng điện thoại.')
          return of(false);
        }));
  }
}
