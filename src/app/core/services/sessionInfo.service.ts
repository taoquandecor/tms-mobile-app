import { Injectable } from '@angular/core';
import { StorageService } from "./storage.service";

@Injectable()
export class SessionInfoService {
  constructor(private storage: StorageService) { }

  private _maNsd: string = "";
  public set maNsd(value: string) {
    this._maNsd = value;
    this.storage.save("maNsd", value)
  }
  public get maNsd(): string {
    if (!this._maNsd) {
      let s = this.storage.load("maNsd");
      if (s) this._maNsd = s;
    }
    return this._maNsd;
  }

  private _tenTruyNhap: string = "";
  public set tenTruyNhap(value: string) {
    this._tenTruyNhap = value;
    this.storage.save("tenTruyNhap", value)
  }
  public get tenTruyNhap(): string {
    if (!this._tenTruyNhap) {
      let s = this.storage.load("tenTruyNhap");
      if (s) this._tenTruyNhap = s;
    }
    return this._tenTruyNhap;
  }

  private _email: string = "";
  public set email(value: string) {
    this._email = value;
    this.storage.save("email", value)
  }
  public get email(): string {
    if (!this._email) {
      let s = this.storage.load("email");
      if (s) this._email = s;
    }
    return this._email;
  }

  private _maNgonNgu: string = "vn";
  public set maNgonNgu(value: string) {
    this._maNgonNgu = value;
    this.storage.save("maNgonNgu", value)
  }
  public get maNgonNgu(): string {
    if (!this._maNgonNgu) {
      let s = this.storage.load("maNgonNgu");
      if (s) this._maNgonNgu = s;
    }
    return this._maNgonNgu;
  }

  private _dauThapPhan: string = ",";
  public set dauThapPhan(value: string) {
    this._dauThapPhan = value;
    this.storage.save("dauThapPhan", value)
  }
  public get dauThapPhan(): string {
    if (!this._dauThapPhan) {
      let s = this.storage.load("dauThapPhan");
      if (s) this._dauThapPhan = s;
    }
    return this._dauThapPhan;
  }

  private _dauPhanNhom: string = ".";
  public set dauPhanNhom(value: string) {
    this._dauPhanNhom = value;
    this.storage.save("dauPhanNhom", value)
  }
  public get dauPhanNhom(): string {
    if (!this._dauPhanNhom) {
      let s = this.storage.load("dauPhanNhom");
      if (s) this._dauPhanNhom = s;
    }
    return this._dauPhanNhom;
  }

  private _dinhDangNgay: string = "dd/MM/yyyy";
  public set dinhDangNgay(value: string) {
    this._dinhDangNgay = value;
    this.storage.save("dinhDangNgay", value)
  }
  public get dinhDangNgay(): string {
    if (!this._dinhDangNgay) {
      let s = this.storage.load("dinhDangNgay");
      if (s) this._dinhDangNgay = s;
    }
    return this._dinhDangNgay;
  }

  private _phanCachNgay: string = "/";
  public set phanCachNgay(value: string) {
    this._phanCachNgay = value;
    this.storage.save("phanCachNgay", value)
  }
  public get phanCachNgay(): string {
    if (!this._phanCachNgay) {
      let s = this.storage.load("phanCachNgay");
      if (s) this._phanCachNgay = s;
    }
    return this._phanCachNgay;
  }

  private _decimalSize: number = 4;
  public set decimalSize(value: number) {
    this._decimalSize = value;
    this.storage.save("decimalSize", String(value))
  }
  public get decimalSize(): number {
    if (!this._decimalSize || this._decimalSize === 0) {
      let s = Number(this.storage.load("decimalSize"));
      if (!isNaN(s)) this._decimalSize = s;
    }
    return this._decimalSize;
  }

  private _decimalPadding: string = "";
  public set decimalPadding(value: string) {
    this._decimalPadding = value;
    this.storage.save("decimalPadding", value)
  }
  public get decimalPadding(): string {
    if (!this._decimalPadding) {
      let s = this.storage.load("decimalPadding");
      if (s) this._decimalPadding = s;
    }
    return this._decimalPadding;
  }

  private _maCanBo: string | undefined;
  public set maCanBo(value: string | undefined) {
    if (value) {
      this._maCanBo = value;
      this.storage.save("maCanBo", value)
    }
    else {
      this._maCanBo = undefined;
      this.storage.remove("maCanBo");
    }
  }
  public get maCanBo(): string | undefined {
    if (!this._maCanBo) {
      let s = this.storage.load("maCanBo");
      if (s) this._maCanBo = s;
    }
    return this._maCanBo;
  }

  private _tenCanBo: string | undefined;
  public set tenCanBo(value: string | undefined) {
    if (value) {
      this._tenCanBo = value;
      this.storage.save("tenCanBo", value);
    }
    else {
      this._tenCanBo = undefined;
      this.storage.remove("tenCanBo");
    }
  }
  public get tenCanBo(): string | undefined {
    if (!this._tenCanBo) {
      let s = this.storage.load("tenCanBo");
      if (s) this._tenCanBo = s;
    }
    return this._tenCanBo;
  }

  public get tenNsd(): string {
    let ten = this.tenCanBo;
    if (!ten) ten = this.tenTruyNhap;
    return ten;
  }

  public get jwtToken(): string | undefined {
    return this.storage.load("jwtToken");
  }

  public set jwtToken(token: string | undefined) {
    if (token) this.storage.save("jwtToken", token);
    else this.storage.remove("jwtToken");
  }

  public get refreshToken(): string | undefined {
    return this.storage.load("refreshToken");
  }

  public set refreshToken(token: string | undefined) {
    if (token) this.storage.save("refreshToken", token);
    else this.storage.remove("refreshToken");
  }

  public get userRole(): string | undefined {
    return this.storage.load("userRole");
  }

  public set userRole(role: string | undefined) {
    if (role) this.storage.save("userRole", role);
    else this.storage.remove("userRole");
  }

  public get isAdmin(): boolean {
    let val = this.storage.load("isAdmin");
    if (val === String(true)) return true;
    else return false;
  }

  public set isAdmin(val: boolean) {
    if (val === true) this.storage.save("isAdmin", String(val));
    else this.storage.remove("isAdmin");
  }

  public get isRootAdmin(): boolean {
    let val = this.storage.load("isRootAdmin");
    if (val === String(true)) return true;
    else return false;
  }

  public set isRootAdmin(val: boolean) {
    if (val === true) this.storage.save("isRootAdmin", String(val));
    else this.storage.remove("isRootAdmin");
  }

  private _decimalMaxSize: number = 10;
  public set decimalMaxSize(value: number) {
    this._decimalMaxSize = value;
    this.storage.save("decimalMaxSize", String(value))
  }
  public get decimalMaxSize(): number {
    if (!this._decimalMaxSize || this._decimalMaxSize === 0) {
      let s = Number(this.storage.load("decimalMaxSize"));
      if (!isNaN(s)) this._decimalMaxSize = s;
    }
    return this._decimalMaxSize;
  }

  private _clientId: string | undefined;
  public set clientId(value: string | undefined) {
    if (value) {
      this._clientId = value;
      this.storage.save("clientId", value);
    }
    else {
      this._clientId = undefined;
      this.storage.remove("clientId");
    }
  }
  public get clientId(): string | undefined {
    if (!this._clientId) {
      let s = this.storage.load("clientId");
      if (s) this._clientId = s;
    }
    return this._clientId;
  }

  public setLang(id: string) {
    if (id === "vn") {
      this.maNgonNgu = "vn";
      this.dinhDangNgay = "dd/MM/yyyy";
      this.dauThapPhan = ",";
      this.dauPhanNhom = ".";
    }
    else {
      this.maNgonNgu = "en";
      this.dinhDangNgay = "MM/dd/yyyy";
      this.dauThapPhan = ".";
      this.dauPhanNhom = ",";
    }
  }

  public clear() {
    this.storage.remove("userRole");
    this.storage.remove("jwtToken");
    this.storage.remove("refreshToken");
    this.storage.remove("maNsd");
    this.storage.remove("tenTruyNhap");
    this.storage.remove("email");
    this.storage.remove("tenCanBo");
    this.storage.remove("maCanBo");
    this.storage.remove("isAdmin");
    this.storage.remove("clientId");
  }
}
