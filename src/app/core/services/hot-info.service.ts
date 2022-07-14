import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DateLib } from '../../shared/utilities/dateLib';

@Injectable()
export class HotInfoService {
  public soLenhDaoTao = 0;
  public soViecMoi = 0;
  public ngayViecMoi: string | undefined;
  public soNsdMoi = 0;
  public soVatTuTon = 0;

  constructor(private dataService: DataService) { }

  public demLenhDaoTao() {
    this.dataService.getRequest(this.dataService.url('/api/training/lenh-dao-tao-thuc-hien/dem-theo-nsd'))
      .subscribe(response => {
        if (response || response === 0) {
          this.soLenhDaoTao = response;
        }
      });
  }

  public layNgayHienTai() {
    return this.dataService.getRequest(this.dataService.url('/api/session/lay-ngay-hien-tai'));
  }

  public demViecMoi() {
    this.dataService.getRequest(this.dataService.url('/api/hrm/giao-viec/lay-so-viec-moi'))
      .subscribe(response => {
        if (response) {
          this.soViecMoi = response.so || 0;
          this.ngayViecMoi = new DateLib().format(response.ngay, 'yyyyMMdd');
        }
      });
  }

  public demNsdMoi() {
    this.dataService.getRequest(this.dataService.url('/api/nsd/lay-so-nsd-moi'))
      .subscribe(response => {
        if (response) {
          this.soNsdMoi = response.so || 0;
        }
      });
  }

  public demVatTuTon() {
    this.dataService.getRequest(this.dataService.url('/api/sale/vat-tu/dem-canh-bao-ton'))
      .subscribe(response => {
        if (response) {
          this.soVatTuTon = response;
        }
        else {
          this.soVatTuTon = 0;
        }
      });
  }

  public soBookingChuaThanhToan = 0;
  public demBookingChuaThanhToan() {
    this.dataService.getRequest(this.dataService.url("/api/sale/booking/dem-booking-chua-thanh-toan"))
      .subscribe(response => {
        if (response) this.soBookingChuaThanhToan = response;
        else this.soBookingChuaThanhToan = 0;
      });
  }
}
