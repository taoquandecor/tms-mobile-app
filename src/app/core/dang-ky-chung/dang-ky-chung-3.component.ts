import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dang-ky-chung-3',
  templateUrl: './dang-ky-chung-3.component.html',
  styleUrls: ['./dang-ky-chung-3.component.css']
})
export class DangKyChung3Component {
  public isNew = false;
  public tenTruyNhap: string | undefined;
  public email: string | undefined;
  public soDienThoai: string | undefined;

  constructor(private activedRoute: ActivatedRoute) {
    this.tenTruyNhap = this.activedRoute.snapshot.queryParamMap.get('t') || undefined;
    this.email = this.activedRoute.snapshot.queryParamMap.get('e') || undefined;
    this.soDienThoai = this.activedRoute.snapshot.queryParamMap.get('s') || undefined;
    this.isNew = (this.activedRoute.snapshot.queryParamMap.get('n') === '1');
  }
}
