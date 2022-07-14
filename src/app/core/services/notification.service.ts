import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { PluginListenerHandle } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { Subject } from 'rxjs';
import { TAlertService } from 'src/app/shared/services/talert.service';
import { DataService, UrlParams } from './data.service';
import { SessionInfoService } from './sessionInfo.service';

@Injectable()
export class NotificationService {
  public token = new Subject<string>();

  private initialized = false;
  private regListener: Promise<PluginListenerHandle> & PluginListenerHandle | undefined = undefined;
  private errListener: Promise<PluginListenerHandle> & PluginListenerHandle | undefined = undefined;

  constructor(
    private session: SessionInfoService,
    private dsv: DataService,
    private talert: TAlertService,
    private router: Router) {

  }

  public init() {
    if (this.initialized) {
      return;
    }

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        this.talert.showInfo(notification.body || notification.title || notification.subtitle || "Bạn có thông báo mới.", true);

        // alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification when app closed
    PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        if (data) {
          if (data.appRoute) {
            this.router.navigate([data.appRoute]);
          }
          else if (data.webUrl) {
            await Browser.open({ url: data.webUrl });
          }
        }

        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );

    this.initialized = true;
  }

  public check(updateToken = false) {
    this.regListener = PushNotifications.addListener('registration',
      (token: Token) => {
        this.regListener?.remove();
        this.regListener = undefined;
        if (updateToken) {
          this.update(token.value);
        }
        else {
          this.token.next(token.value);
        }
      }
    );

    this.errListener = PushNotifications.addListener('registrationError',
      () => {
        this.errListener?.remove();
        this.errListener = undefined;
        this.talert.showWarning('Không thể gửi tin thông báo kết quả đăng ký.');
      }
    );

    const rem = () => {
      if (this.regListener) {
        this.regListener.remove();
        this.regListener = undefined;
      }
      if (this.errListener) {
        this.errListener.remove();
        this.errListener
      }
    };

    this.dsv.getRequest(this.dsv.url("/api/notification-config/check",
      [
        new UrlParams("clientId", this.session.clientId)
      ])).subscribe(res => {
        if (res) {
          this.session.clientId = res.clientId;

          if (res.exists) {
            rem();
          }
          else {
            PushNotifications.requestPermissions().then(result => {
              if (result.receive === 'granted') {
                PushNotifications.register();
              } else {
                this.talert.showWarning('Chưa được cấp quyền nhận thông báo kết quả đăng ký.');
              }
            });
          }
        }
        else {
          rem();
        }
      }, () => {
        rem();
      });
  }

  private update(token: string) {
    this.dsv.postRequest(this.dsv.url('api/notification-config/cap-nhat',
      [
        new UrlParams('clientId', this.session.clientId),
        new UrlParams('token', token),
      ]), undefined).subscribe();
  }
}
