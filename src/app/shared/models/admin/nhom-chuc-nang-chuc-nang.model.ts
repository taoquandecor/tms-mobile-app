import { BaseModel } from "../common/base.model";

export class NhomChucNangChucNang extends BaseModel {
  public maPK: string | undefined;
  public maNhomChucNang: string | undefined;
  public soThuTu: number | undefined;
  public maChucNang: string | undefined;
  public ten: string | undefined;
  public mauChu: string | undefined;
  public mauNen: string | undefined;
  public fontWeight: string | undefined;
  public fontStyle: string | undefined;
  public fontDecoration: string | undefined;
  public cssClass: string | undefined;
  public loaiTrung = false;
  public macDinh = false;
  public trangThai: string | undefined;
  public tenChucNang: string | undefined;
  public tenFile: string | undefined;
  public noiDungFile: string | undefined;
  public route: string | undefined;
  public mobileRoute: string | undefined;
  public chon: boolean | undefined;

  public constructor(
    fields?: {
      maPK?: string,
      maNhomChucNang?: string,
      soThuTu?: number,
      maChucNang?: string,
      ten?: string,
      mauChu?: string,
      mauNen?: string,
      fontWeight?: string,
      fontStyle?: string,
      fontDecoration?: string,
      cssClass?: string,
      loaiTrung?: boolean,
      macDinh?: boolean,
      trangThai?: string,
      rowState?: string,
      tenChucNang?: string
    }) {
    super();
    if (fields) Object.assign(this, fields);
  }
}
