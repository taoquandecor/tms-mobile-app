import { BaseModel } from '../../shared/models/common/base.model';

export class UserRegister extends BaseModel {
  public maPK: string | undefined;
  public tenTruyNhap: string | undefined;
  public email: string | undefined;
  public soDienThoai: string | undefined;
  public trangThai: string | undefined;
  public thoiGian: Date | undefined;
  public maLyDo: string | undefined;
  public tenLyDo: string | undefined;
  public ghiChu: string | undefined;
  public ten: string | undefined;
  public diaChi: string | undefined;
  public maSoThue: string | undefined;
  public hoNguoiDangKy: string | undefined;
  public tenNguoiDangKy: string | undefined;
  public maCha: string | undefined;
  public tenCha: string | undefined;
  public tenTruyNhapCha: string | undefined;
  public emailCha: string | undefined;
  public soDienThoaiCha: string | undefined;
  public matKhau: string | undefined;
  public ngayTaoDuLieu: Date | undefined;
  public maLoaiHinhKinhDoanh: string | undefined;
  public hanThanhToan: Date | undefined;
  public maUserInfo: string | undefined;
  public trangThaiUserInfo: string | undefined;

  public constructor(
    fields?: {
      rowState?: string;
    }) {
    super();
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
