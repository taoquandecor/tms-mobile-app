import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptographyService } from '../../core/services/cryptography.service';
import { DataService, UrlParams } from '../../core/services/data.service';
import { LoaiHinhKinhDoanh } from '../../register/models/loai-hinh-kinh-doanh.model';
import { UserRegister } from '../../register/models/user-register.model';
import { RowState } from '../../shared/models/common/base.model';
import { DataOutput } from '../../shared/models/common/data-output.model';
import { TAlertService } from '../../shared/services/talert.service';
import { UiLib } from '../../shared/utilities/uiLib';
import { NotificationService } from '../services/notification.service';
import { SessionInfoService } from '../services/sessionInfo.service';

@Component({
  selector: 'dang-ky-chung-2',
  templateUrl: './dang-ky-chung-2.component.html',
  styleUrls: ['./dang-ky-chung-2.component.css']
})
export class DangKyChung2Component implements OnInit {
  public chaError = false;
  public nsd: UserRegister = new UserRegister({ rowState: RowState.added });
  public captchaImage: string | undefined = undefined;
  public captcha: string | undefined = undefined;
  public loaiHinhs: LoaiHinhKinhDoanh[] = [];
  public isMoi: boolean | undefined = undefined;
  public dataLoading = false;
  public isLayCha = false;
  public job: {
    tenTruyNhap: boolean | undefined;
    email: boolean | undefined;
    soDienThoai: boolean | undefined;
  } = {
      tenTruyNhap: undefined,
      email: undefined,
      soDienThoai: undefined
    };
  public exists: {
    tenTruyNhap: boolean | undefined;
    email: boolean | undefined;
    soDienThoai: boolean | undefined;
  } = {
      tenTruyNhap: undefined,
      email: undefined,
      soDienThoai: undefined
    };

  private captchaId: string | undefined = undefined;
  private mkNhacLai: string | undefined;
  private token: string | undefined = undefined;

  constructor(private talert: TAlertService,
    private dataService: DataService,
    private crypto: CryptographyService,
    private activedRoute: ActivatedRoute,
    private router: Router,
    private nsv: NotificationService,
    private session: SessionInfoService) {

    this.layLoaiHinh();
    this.layCaptcha();

    this.nsv.token.subscribe(res => {
      this.token = res;
    });
    this.nsv.check();
  }

  ngOnInit(): void {
    this.isMoi = (this.activedRoute.snapshot.paramMap.get('p') === '1');
  }

  public set nhacLaiMatKhau(value: string) {
    this.mkNhacLai = value;
  }

  public register(e: Event) {
    e.preventDefault();

    if (this.nsd.matKhau !== this.mkNhacLai) {
      this.talert.showWarning('M???t kh???u c???n tr??ng v???i nh???c l???i m???t kh???u!');
      return;
    }

    if (!this.nsd.maLoaiHinhKinhDoanh) {
      this.talert.showWarning('B???n ch??a ch???n Lo???i h??nh kinh doanh!');
      return;
    }

    const pre = this.nsd.matKhau;
    this.dataLoading = true;
    const err = 'B???n ???? ????ng k?? kh??ng th??nh c??ng. Xin h??y li??n h??? v???i qu???n tr??? h??? th???ng ????? nh???n h??? tr???.';
    this.dataService.getRequest(this.dataService.url('/api/dang-ky/lay-random-string'))
      .subscribe((response: any) => {
        const k = response.randomString;
        this.nsd.matKhau = this.crypto.encryptRsa(this.crypto.sha256(this.nsd.matKhau), k);

        this.dataService.postRequest(this.dataService.url('/api/dang-ky/dang-ky',
          [
            new UrlParams('captcha', this.captcha),
            new UrlParams('sessionId', response.sessionId),
            new UrlParams('captchaId', this.captchaId),
            new UrlParams('clientId', this.session.clientId),
            new UrlParams('token', this.token),
          ]), this.nsd, false, false)
          .subscribe((res: DataOutput) => {
            this.dataLoading = false;

            if (res) {
              const outs = res.dataOutputs;
              if (res.success === false) {
                if (outs) {
                  let chk = outs.find(f => f.changedColumn === '#Captcha');
                  if (chk) {
                    if (chk.changedValue === '-2') {
                      this.talert.showWarning('M?? x??c th???c kh??ng ????ng.');
                    }
                    else if (chk.changedValue === '-1') {
                      this.talert.showWarning('M?? x??c th???c h???t h???n.');
                    }
                    else {
                      this.talert.showWarning('M?? x??c th???c kh??ng h???p l???.');
                    }

                    this.layCaptcha();
                    return false;
                  }

                  chk = outs.find(f => f.changedColumn === '#TenTruyNhap');
                  if (chk && chk.changedValue === false) {
                    this.talert.showWarning('T??n truy nh???p ???? c??.');
                    this.layCaptcha();
                    return false;
                  }

                  chk = outs.find(f => f.changedColumn === '#Email');
                  if (chk && chk.changedValue === false) {
                    this.talert.showWarning('Email ???? c??.');
                    this.layCaptcha();
                    return false;
                  }

                  chk = outs.find(f => f.changedColumn === '#SoDienThoai');
                  if (chk && chk.changedValue === false) {
                    this.talert.showWarning('S??? ??i???n tho???i ???? c??.');
                    this.layCaptcha();
                    return false;
                  }
                }
                else {
                  this.talert.showError('L???i h??? th???ng.');
                  this.layCaptcha();
                  return false;
                }
              }
              else {
                this.talert.showSuccess('B???n ???? ????ng k?? th??nh c??ng.');
                this.router.navigate(['/dang-ky-kq'],
                  {
                    queryParams: {
                      t: this.nsd.tenTruyNhap || this.nsd.email || this.nsd.soDienThoai,
                      e: this.nsd.email,
                      s: this.nsd.soDienThoai,
                      n: !this.nsd.maCha ? '1' : '2'
                    }
                  });
              }

              return true;
            }
            else {
              this.talert.showError(err);
              this.layCaptcha();
              return false;
            }
          }, () => {
            this.talert.showError(err);
            this.layCaptcha();
          }, () => { this.nsd.matKhau = pre; });
      }, () => {
        this.talert.showError(err);
        this.layCaptcha();
      }, () => { this.nsd.matKhau = pre; });
  }

  public checkExists() {
    if (!this.nsd.tenTruyNhap && !this.nsd.email && !this.nsd.soDienThoai) {
      return;
    }

    if (this.nsd.tenTruyNhap) {
      this.job.tenTruyNhap = true;
    }
    else {
      this.job.tenTruyNhap = undefined;
    }

    if (this.nsd.email) {
      this.job.email = true;
    }
    else {
      this.job.email = undefined;
    }

    if (this.nsd.soDienThoai) {
      this.job.soDienThoai = true;
    }
    else {
      this.job.soDienThoai = undefined;
    }

    this.exists.tenTruyNhap = undefined;
    this.exists.email = undefined;
    this.exists.soDienThoai = undefined;

    this.dataService.getRequest(this.dataService.url('/api/dang-ky/kiem-tra',
      [
        new UrlParams('tenTruyNhap', this.nsd.tenTruyNhap),
        new UrlParams('email', this.nsd.email),
        new UrlParams('soDienThoai', this.nsd.soDienThoai)
      ]))
      .subscribe((response: DataOutput) => {
        if (response && response.dataOutputs) {
          const ttn = response.dataOutputs.find(f => f.changedColumn === '#TenTruyNhap' && f.changedValue === false);
          if (ttn) {
            this.exists.tenTruyNhap = true;
          }

          const email = response.dataOutputs.find(f => f.changedColumn === '#Email' && f.changedValue === false);
          if (email) {
            this.exists.email = true;
          }

          const sdt = response.dataOutputs.find(f => f.changedColumn === '#SoDienThoai' && f.changedValue === false);
          if (sdt) {
            this.exists.soDienThoai = true;
          }
        }

        this.job.tenTruyNhap = undefined;
        this.job.email = undefined;
        this.job.soDienThoai = undefined;
      });
  }


  public viewAnh() {
    if (this.captchaImage) {
      return new UiLib().getImageDisplay('captcha.png', this.captchaImage);
    }

    return undefined;
  }

  public layLaiCaptcha() {
    this.layCaptcha();
  }

  public setCha(v: string) {
    this.nsd.tenCha = v;
    if (v) {
      this.layCha(v);
    }
    else {
      this.chaError = false;
      this.nsd.maCha = undefined;
      this.nsd.ten = undefined;
      this.nsd.diaChi = undefined;
      if (this.chonEmpty()) {
        this.nsd.maLoaiHinhKinhDoanh = undefined;
      }
    }
  }

  public chonEmpty() {
    return (this.loaiHinhs.length > 1);
  }

  private layCaptcha() {
    this.captchaImage = undefined;
    this.dataService.getRequest(this.dataService.url('/api/dang-ky/lay-captcha'))
      .subscribe(response => {
        if (response) {
          this.captchaId = response.sessionId;
          this.captchaImage = response.image;
        }
      });
  }

  private layLoaiHinh() {
    this.loaiHinhs = [];
    this.dataService.getRequest(this.dataService.url('/api/dang-ky/lay-loai-hinh-kinh-doanh'))
      .subscribe(response => {
        if (response) {
          this.loaiHinhs = response;
          if (this.loaiHinhs.length === 1) {
            this.nsd.maLoaiHinhKinhDoanh = this.loaiHinhs[0].maPK;
          }
        }
      });
  }

  private layCha(emailOrSoDienThoai: string) {
    this.nsd.maCha = undefined;

    if (!emailOrSoDienThoai) {
      this.chaError = false;
      return;
    }

    this.isLayCha = true;
    this.dataService.getRequest(this.dataService.url('/api/dang-ky/lay-cha', [new UrlParams('emailOrSoDienThoai', emailOrSoDienThoai)]))
      .subscribe(response => {
        if (response) {
          this.nsd.maCha = response[0].maPK;
          this.nsd.ten = response[0].ten;
          this.nsd.diaChi = response[0].diaChi;
          this.nsd.maLoaiHinhKinhDoanh = response[0].maLoaiHinhKinhDoanh;

          this.chaError = false;
        }
        else {
          this.chaError = true;
        }

        this.isLayCha = false;
      });
  }

}
