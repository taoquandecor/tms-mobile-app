import { EventEmitter, Injectable, Output } from "@angular/core";
import { DataService } from "../../core/services/data.service";
import { NsdBan } from "../../shared/models/relation/nsd-ban.model";

@Injectable()
export class BanBeService {
  constructor(private dataService: DataService) { }

  public friendRequestedCount = 0;
  public getFriendRequestedCount() {
    this.dataService.getRequest(this.dataService.url("/api/yeu-cau-ket-ban/dem-yeu-cau"))
      .subscribe(response => {
        if (response) this.friendRequestedCount = response;
        else this.friendRequestedCount = 0;
      });
  }

  public friendCount = 0;
  public getFriendCount() {
    this.dataService.getRequest(this.dataService.url("/api/ban/dem-ban"))
      .subscribe(response => {
        if (response) this.friendCount = response;
        else this.friendCount = 0;
      });
  }

  public friendSinhNhatCount = 0;
  public getFriendSinhNhatCount() {
    this.dataService.getRequest(this.dataService.url("/api/ban/dem-ban-sinh-nhat"))
      .subscribe(response => {
        if (response) this.friendSinhNhatCount = response;
        else this.friendSinhNhatCount = 0;
      });
  }

  public friends: NsdBan[] = [];
  public getFriends() {
    this.dataService.getRequest(this.dataService.url("/api/ban/xem-ban"))
      .subscribe(response => {
        if (response) {
          this.friends = response;
          this.friends.forEach(f => f.ten = (f.tenCanBo ? f.tenCanBo : f.tenTruyNhap));
        }
        else this.friends = [];

        this.friendFetched.emit();
      });
  }

  public friendSinhNhats: NsdBan[] = [];
  public getFriendSinhNhats() {
    this.dataService.getRequest(this.dataService.url("/api/ban/xem-ban-sinh-nhat"))
      .subscribe(response => {
        if (response) {
          this.friendSinhNhats = response;
          this.friendSinhNhats.forEach(f => f.ten = (f.tenCanBo ? f.tenCanBo : f.tenTruyNhap));
        }
        else this.friendSinhNhats = [];
      });
  }

  @Output() friendFetched = new EventEmitter();
}
