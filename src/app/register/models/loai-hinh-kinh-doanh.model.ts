import { BaseModel } from '../../shared/models/common/base.model';

export class LoaiHinhKinhDoanh extends BaseModel {
  public maPK: string | undefined;
  public soThuTu: number | undefined;
  public ma: string | undefined;
  public ten: string | undefined;
  public maNhoms: string | undefined;

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
