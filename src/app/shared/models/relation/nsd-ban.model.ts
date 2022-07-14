import { BaseModel } from "../common/base.model";

export class NsdBan extends BaseModel {
  public maPK: string | undefined;
  public maNsd: string | undefined;
  public maNsdBan: string | undefined;
  public thoiGian: Date | undefined;
  public email: string | undefined;
  public tenTruyNhap: string | undefined;
  public trangThai: string | undefined;
  public tenCanBo: string | undefined;
  public tenDonVi: string | undefined;
  public tenFile: string | undefined;
  public anh: string | undefined;
  public ten: string | undefined;   //tenCanBo ?? tenTruyNhap
  public ngaySinh: string | undefined;
  public soNgay: number | undefined; //Số ngày đến sinh nhật tính từ hiện tại
  public soDienThoai: string | undefined;

  public constructor(
    fields?: {
      maPK?: string,
      maNsd?: string,
      maNsdBan?: string,
      rowState?: string
    }) {
    super();
    if (fields) Object.assign(this, fields);
  }
}
