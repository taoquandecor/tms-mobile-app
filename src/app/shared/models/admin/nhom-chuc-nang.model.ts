import { BaseModel } from "../common/base.model";

export class NhomChucNang extends BaseModel {
  public maPK: string | undefined;
  public soThuTu: number | undefined;
  public ten: string | undefined;
  public maCha: string | undefined;
  public mauChu: string | undefined;
  public mauNen: string | undefined;
  public fontWeight: string | undefined;
  public fontStyle: string | undefined;
  public fontDecoration: string | undefined;
  public cssClass: string | undefined;
  public macDinh = false;
  public trangThai: string | undefined;
  public tenFile: string | undefined;
  public noiDungFile: string | undefined;

  public constructor(
    fields?: {
      maPK?: string,
      soThuTu?: number,
      ten?: string,
      maCha?: string,
      mauChu?: string,
      mauNen?: string,
      fontWeight?: string,
      fontStyle?: string,
      fontDecoration?: string,
      cssClass?: string,
      macDinh?: boolean,
      trangThai?: string,
      rowState?: string
    }) {
    super();
    if (fields) Object.assign(this, fields);
  }
}
