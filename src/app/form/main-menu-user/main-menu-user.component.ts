import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { filter, map } from "rxjs/operators";
import { StringLib } from "../../shared/utilities/stringLib";
import { AuthenticationService } from "../../core/services/authentication.service";
import { DataService, UrlParams } from "../../core/services/data.service";
import { HotInfoService } from "../../core/services/hot-info.service";
import { ParamsService } from "../../core/services/params.service";
import { SessionInfoService } from "../../core/services/sessionInfo.service";
import { StorageService } from "../../core/services/storage.service";
import { NhomChucNangChucNang } from "../../shared/models/admin/nhom-chuc-nang-chuc-nang.model";
import { NhomChucNang } from "../../shared/models/admin/nhom-chuc-nang.model";
import { ClientLanguage } from "../../shared/models/common/client-language.model";
import { UiLib } from "../../shared/utilities/uiLib";
import { BanBeService } from "../services/ban-be.service";
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'main-menu-user',
  templateUrl: './main-menu-user.component.html',
  styleUrls: ['./main-menu-user.component.css']
})
export class MainMenuUserComponent implements OnInit {
  ngOnInit(): void {
    let langId = this.storage.load("LanguageId");
    let nn: any = undefined;
    if (langId) {
      nn = this.ngonNgus.find(n => n.id == langId);
    }

    if (nn) this.changeLanguage(nn)
    else {
      let n = this.ngonNgus.find(n => n.isDefault == true);
      if (n) this.changeLanguage(n);
      else this.changeLanguage(this.ngonNgus[0]);
    }

    this.layNhom();
    this.layLogo();

    this.demThongBao();
    this.displayFloat = !this.storage.loadSession(this.hideFloatKey);
  }

  constructor(private paraService: ParamsService,
    private translate: TranslateService,
    private storage: StorageService,
    private dataService: DataService,
    private router: Router,
    private authService: AuthenticationService,
    public banService: BanBeService,
    public hotInfoService: HotInfoService,
    public session: SessionInfoService) {

    this.ngonNgus = this.paraService.clientLanguages || [];
    if (!this.ngonNgus || this.ngonNgus.length === 0) {
      this.ngonNgus.push(new ClientLanguage("vn", "Tiếng Việt", "vn", true, undefined));
    }

    router.events.pipe(filter(e => e instanceof NavigationStart), map(e => e as NavigationStart))
      .subscribe(event => {
        if (event.navigationTrigger === 'popstate') {
          if (event.url && event.url.toLowerCase() === "/form") {
            if (this.currNhom) {
              this.nhomClick(this.currNhom);
            }
          }
        }
      });

    this.kiemTraQuyenFloat();
  }

  private readonly hideFloatKey = "HideNewUser";
  private ngonNgus: ClientLanguage[] = [];
  public nhoms: NhomChucNang[] = [];
  public nhomcns: NhomChucNangChucNang[] = [];
  public currNhom: NhomChucNang | undefined;
  public cnDisplay: boolean = true;
  private showDefaultMenu: boolean = false;
  public filter: string | undefined;
  public displayFloat: boolean = false;
  public quyenFloat: boolean = false;
  public logo: { tenFile?: undefined, noiDung?: undefined, website?: string } | undefined = undefined;

  public get soThongBao() {
    return (this.banService.friendSinhNhatCount > 0 ? 1 : 0)
      + (this.banService.friendRequestedCount > 0 ? 1 : 0)
      + (this.hotInfoService.soViecMoi > 0 ? 1 : 0)
      + (this.hotInfoService.soLenhDaoTao > 0 ? 1 : 0)
      + (this.hotInfoService.soNsdMoi > 0 ? 1 : 0)
      + (this.hotInfoService.soVatTuTon > 0 ? 1 : 0)
      + (this.hotInfoService.soBookingChuaThanhToan > 0 ? 1 : 0);
  }

  private changeLanguage(ngonNgu: ClientLanguage): void {
    this.dataService.postRequest(this.dataService.url("/api/session/change-ngon-ngu/" + ngonNgu.id), undefined)
      .subscribe(() => {
        this.translate.use(ngonNgu.file);
        this.storage.save("LanguageId", ngonNgu.id);
      });
  }

  private layNhom() {
    this.nhoms = [];
    this.nhomcns = [];
    this.currentJob = "layChucNang";
    this.dataService.getRequest("/api/nhom-chuc-nang/lay-theo-nsd")
      .subscribe(res => {
        if (res) {
          this.nhoms = res;
          if (this.showDefaultMenu) {
            let n = this.nhoms.find(f => f.macDinh);
            if (n) {
              this.currNhom = n;
            }
            else {
              this.currNhom = this.nhoms[0];
            }

            this.layChucNang(this.currNhom, true);
          }
        }

        this.currentJob = undefined;
      });
  }

  private layChucNang(nhom: NhomChucNang, macDinh: boolean = false) {
    this.nhomcns = [];
    this.currentJob = "layChucNang";
    this.dataService.getRequest(this.dataService.url("/api/nhom-chuc-nang/lay-chuc-nang-theo-nsd", [new UrlParams("maNhomChucNang", nhom.maPK)]))
      .subscribe(res => {
        if (res) {
          this.nhomcns = res;
          this.toggle.emit(true);

          if (this.nhomcns.length === 1) {
            this.chucNangClick(this.nhomcns[0]);
          }
          else if (macDinh) {
            let cn = this.nhomcns.find(c => c.macDinh);
            if (cn) {
              this.chucNangClick(cn);
            }
          }
        }

        this.currentJob = undefined;
      });
  }

  private kiemTraQuyenFloat() {
    this.quyenFloat = false;
    this.dataService.getRequest(this.dataService.url("/api/admin/chuc-nang/check-quyen-khoi-tao-nsd"))
      .subscribe(res => {
        if (res == true) {
          this.quyenFloat = true;
        }
        else {
          this.quyenFloat = false;
        }
      });
  }

  private layLogo() {
    this.logo = undefined;
    this.dataService.getRequest(this.dataService.url("/api/don-vi/lay-anh"))
      .subscribe(res => {
        if (res) {
          this.logo = { tenFile: res.tenFile, noiDung: res.noiDung, website: res.website };
        }
      });
  }

  public layAnh(row: NhomChucNang | NhomChucNangChucNang) {
    if (row.tenFile) return new UiLib().getImageDisplay(row.tenFile, row.noiDungFile);
    else return undefined;
  }

  public nhomClick(n: NhomChucNang) {
    this.demThongBao();

    if (this.router.url && this.router.url.toLowerCase() === "/form") {
      if (this.currNhom !== n) {
        this.currNhom = n;
        this.layChucNang(n);
      }
      else {
        if (!this.cnDisplay) {
          this.toggle.emit(true);
        }
      }

      if (!this.cnDisplay) {
        this.cnDisplay = true;
      }
    }
    else {
      this.router.navigate(["/form"]).then(val => {
        // Check với các component hỏi lưu
        if (val) {
          if (this.currNhom !== n) {
            this.currNhom = n;
            this.layChucNang(n);
          }
          else {
            if (!this.cnDisplay) {
              this.toggle.emit(true);
            }
          }

          if (!this.cnDisplay) {
            this.cnDisplay = true;
          }
        }
      });
    }
  }

  public chucNangViews() {
    if (this.currNhom) return this.nhomcns.filter(f => !this.filter || StringLib.inVns(this.filter, f.ten))
    else return [];
  }

  public chucNangClick(cn: NhomChucNangChucNang) {
    if (cn.route === "logout") {
      this.authService.logout();
    }
    else {
      this.demThongBao();

      //this.cnDisplay = false;
      //this.toggle.emit(false);

      if (cn.route) this.navigate(cn.route);
      else this.navigate('form/bao-cao/bao-cao', undefined, cn.maPK);
    }
  }

  public thongBaoClick() {
    this.demThongBao();
  }

  public thongBaoItemClick(action: string, e: Event) {
    e.preventDefault();

    //this.cnDisplay = false;
    //this.toggle.emit(false);
    //this.currNhom = undefined;

    if (action === "sinhNhat") {
      this.navigate("form/ban-be", 'p=sn');
    }
    else if (action === "ketBan") {
      this.navigate("form/ban-be", 'p=yc');
    }
    else if (action === "giaoViec") {
      this.navigate("form/nhan-su/giao-viec", 'n=' + (this.hotInfoService.ngayViecMoi || ''));
    }
    else if (action === "daoTao") {
      this.navigate("form/dao-tao/tra-loi-cau-hoi");
    }
    else if (action === "phanQuyen") {
      this.navigate("form/khoi-tao/quan-ly-nsd");
    }
    else if (action === "vatTuTon") {
      this.navigate("form/kho/vat-tu-canh-bao-ton");
    }
    else if (action === "doiMatKhau") {
      this.navigate("form/doi-mat-khau", undefined, undefined, true);
    }
    else if (action === "bookingChuaThanhToan") {
      this.navigate("form/ban-hang/booking", 'ctt=1');
    }
    else if (action === "dangXuat") {
      this.authService.logout();
    }
    else if (action === "dong") {
      App.exitApp();
    }
  }

  public checkDisplayFloat(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.displayFloat = !this.displayFloat;

    if (this.displayFloat) this.storage.removeSession(this.hideFloatKey);
    else this.storage.saveSession(this.hideFloatKey, "1");
  }

  public logoView() {
    if (this.logo) {
      return new UiLib().getImageDisplay(this.logo.tenFile, this.logo.noiDung);
    }

    return undefined;
  }

  public logoClick(e: Event) {
    e.preventDefault();
    if (this.logo?.website) {
      Browser.open({ url: this.logo.website });
    }
  }

  public isFa(classNames: string | undefined) {
    return (classNames && classNames.indexOf('fa-') > -1);
  }

  public isGo(classNames: string | undefined) {
    return (classNames && classNames.indexOf('fa-') < 0);
  }

  private demThongBao() {
    this.banService.getFriendRequestedCount();
    this.banService.getFriendSinhNhatCount();
    this.hotInfoService.demLenhDaoTao();
    this.hotInfoService.demViecMoi();
    this.hotInfoService.demNsdMoi();
    this.hotInfoService.demVatTuTon();
    this.hotInfoService.demBookingChuaThanhToan();
  }

  public get contactEmail() {
    return this.paraService.contactEmail;
  }

  public get contactPhone() {
    return this.paraService.contactPhone;
  }

  public get formatPhone() {
    return this.paraService.formatPhone();
  }

  private currentJob: string | undefined;
  public status(job: string): boolean {
    if (job === this.currentJob) return true;
    else return false;
  }

  public navigate(route: string, queryString?: string, repPK?: string | undefined, fixedMobile = false) {
    const url = route.endsWith('/') ? route.substr(route.length - 1, 1) : route;
    const ext = (repPK ? '/' + repPK : '') + (queryString ? '?' + queryString : '');

    const hideMenu = () => {
      this.cnDisplay = false;
      this.toggle.emit(false);
      //this.currNhom = undefined;
    }

    if (fixedMobile) {
      hideMenu();
      this.router.navigateByUrl(url + ext);
    }
    else {
      const r = this.nhomcns.find(f => f.route === route);
      if (r) {
        if (r.mobileRoute) {
          hideMenu();
          this.router.navigateByUrl(r.route + ext);
        }
        else {
          if (r.route) {
            this.openWeb(url, queryString, repPK);
          }
        }
      }
      else {
        this.openWeb(url, queryString, repPK);
      }
    }
  }

  public goAdmin(e: Event) {
    e.preventDefault();
    Browser.open({ url: this.paraService.clientBaseUrl + '/admin' });
  }

  private openWeb(route?: string, queryString?: string, repPK?: string) {
    let ext = (repPK ? '/' + repPK : '') + (queryString ? '?' + queryString : '');
    if (this.authService.authenticated) {
      this.authService.initOpenWeb().subscribe(res => {
        if (res && res.clientId && res.sessionId && res.maNgonNgu) {
          ext += (queryString ? '&' : '?') + ('w1=' + res.clientId + '&w2=' + res.sessionId + '&w3=' + res.maNgonNgu);
          Browser.open({ url: this.paraService.clientBaseUrl + '/' + route + ext });
        }
      });
    }
    else {
      Browser.open({ url: this.paraService.clientBaseUrl + '/' + route + ext });
    }
  }

  @Input() set showDefault(v: boolean) {
    this.showDefaultMenu = v;
    this.cnDisplay = v;
  }

  @Output() toggle = new EventEmitter<boolean>();
}
