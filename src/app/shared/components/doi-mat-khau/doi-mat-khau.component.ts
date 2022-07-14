import { Component } from "@angular/core";
import { TAlertService } from "../../services/talert.service";
import { AuthenticationService } from "../../../core/services/authentication.service";

@Component({
  selector: "doi-mat-khau",
  templateUrl: "./doi-mat-khau.component.html",
  styleUrls: ['./doi-mat-khau.component.css']
})
export class DoiMatKhauComponent {
  constructor(private talert: TAlertService, private authService: AuthenticationService) { }

  public matKhauCu: string | undefined;
  public matKhauMoi: string | undefined;
  public nhacLaiMatKhau: string | undefined;

  public dataLoading: boolean = false;

  public doiMatKhau(e: Event) {
    this.dataLoading = true;
    this.authService.doiMatKhau(this.matKhauCu, this.matKhauMoi).
      subscribe(x => {
        this.dataLoading = false;

        if (!x || !x.msg) {
          this.talert.showError("Không đổi được mật khẩu.");
        }
      });
  }
}
