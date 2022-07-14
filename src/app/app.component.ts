import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ParamsService } from './core/services/params.service';
import { SessionInfoService } from './core/services/sessionInfo.service';
import { SizeService } from './shared/services/size.service';
import { App, BackButtonListenerEvent } from '@capacitor/app';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private title: Title,
    private trans: TranslateService,
    paras: ParamsService,
    private session: SessionInfoService,
    private size: SizeService,
    private nsv: NotificationService) {

    this.trans.onLangChange.subscribe((event: any) => {
      if (event) this.session.setLang(event.lang);

      this.trans.get(paras.appTitle).subscribe(t => {
        this.title.setTitle(t);
      });
    });
  }

  ngOnInit(): void {
    App.addListener('backButton', (event: BackButtonListenerEvent) => {
      if (event.canGoBack) {
        window.history.back();
      }
      else {
        App.exitApp();
      }
    });

    this.nsv.init();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.size.clientHeight = event.target.innerHeight;
    this.size.clientWidth = event.target.innerWidth;
  }
}
