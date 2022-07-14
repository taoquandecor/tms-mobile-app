import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { AuthenticationService } from '../services/authentication.service';
import { ParamsService } from '../services/params.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'dang-nhap',
  templateUrl: './dang-nhap.component.html',
  styleUrls: ['./dang-nhap.component.css']
})
export class DangNhapComponent implements OnInit {
  public matKhau: string | undefined;
  public cookieDisplay = true;
  private isLoggingin = false;

  constructor(public authService: AuthenticationService,
    private storage: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private paramService: ParamsService) {

     }

  ngOnInit(): void {
    const ui = this.activatedRoute.snapshot.queryParamMap.get('userId');
    if (ui) {
      this.authService.tenTruyNhap = ui;
    }
    else {
      this.authService.tenTruyNhap = this.storage.load('TenTruyNhap') || '';
    }

    const pass = this.activatedRoute.snapshot.queryParamMap.get('pwd');
    if (ui && pass && ui.toLowerCase() === 'demo@sytech.vn' && pass === '111') {
      this.matKhau = pass;
      this.login(undefined);
    }

    this.cookieDisplay = true;
    const ck = this.storage.load('CookieConsent');
    if (ck === '1') {
      this.cookieDisplay = false;
    }
  }

  public checkFocus(loai: number) {
    if (loai === 1) {
      if (this.authService.tenTruyNhap) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      if (this.authService.tenTruyNhap) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  login(e: Event | undefined) {
    this.isLoggingin = true;
    this.authService.matKhau = this.matKhau;
    this.authService.login()
      .subscribe(() => {
        this.isLoggingin = false;
        //if (result) {
        //  if (this.authService.tenTruyNhap) this.storage.save("TenTruyNhap", this.authService.tenTruyNhap);
        //}
      });
  }


  get dataLoading(): boolean {
    return this.isLoggingin;
  }

  public quenMatKhau(e: Event) {
    this.router.navigateByUrl('lay-lai-mat-khau');
  }

  public dangKy(e: Event) {
    this.router.navigateByUrl('dang-ky');
  }

  public get contactEmail() {
    return this.paramService.contactEmail;
  }

  public get contactPhone() {
    return this.paramService.contactPhone;
  }

  public get formatPhone() {
    const cleaned = ('' + this.paramService.contactPhone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{3})(\d{4})$/);
    if (match) {
      return '+' + match[1] + ' '+ match[2] + ' ' + match[3] + ' ' + match[4];
    }

    return this.paramService.contactPhone;
  }

  public acceptCookie() {
    this.storage.save('CookieConsent', '1');
    this.cookieDisplay = false;
  }

  public helpClick(e: Event) {
    e.preventDefault();
    Browser.open({ url: this.paramService.clientBaseUrl + '/Help/TsmIntroduction.html' });
  }
}
