import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TAlertService {
  constructor(private toastr: ToastrService, private translate: TranslateService) {
  }

  public showSuccess(msg: string) {
    this.translate.get(msg).subscribe((res: string) => {
      this.toastr.success(res);
    });
  }

  public showError(msg: string) {
    this.translate.get(msg).subscribe((res: string) => {
      this.toastr.error(res, undefined, { closeButton: true, tapToDismiss: false, disableTimeOut: true });
    });
  }

  public showWarning(msg: string, keepOpen: boolean = false) {
    this.translate.get(msg).subscribe((res: string) => {
      if (keepOpen) this.toastr.warning(res, undefined, { closeButton: true, tapToDismiss: false, disableTimeOut: true });
      else this.toastr.warning(res);
    });
  }

  public showInfo(msg: string, outside = false) {
    this.translate.get(msg).subscribe((res: string) => {
      if (outside) {
        this.toastr.info(res, undefined, { onActivateTick : true });
      }
      else {
        this.toastr.info(res);
      }
    });
  }

  public readonly msgLoadStatus: string = "Dữ liệu được lấy thành công.";
  public readonly msgSaveStatus: string = "Dữ liệu được lưu thành công.";
  public readonly msgChangedAlert: string = "Dữ liệu đã được thay đổi. Bấm Cancel để quay lại rồi lưu hoặc bấm OK để không lưu.";
  public readonly msgDeleteRowQuestion: string = "Bạn có thực sự muốn xoá dòng hiện tại không?";
  public readonly msgSaveQuestion: string = "Dữ liệu đã được thay đổi. Bạn có muốn lưu lại không?";
}
