import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ParamsService } from './services/params.service';
import { StorageService } from './services/storage.service';
import { SessionInfoService } from './services/sessionInfo.service';
import { HotInfoService } from './services/hot-info.service';
import { CoreRoutingModule } from './core-routing.module';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationGuard } from './services/authentication.guard';
import { CryptographyService } from './services/cryptography.service';
import { DataService } from './services/data.service';
import { DangNhapComponent } from './dang-nhap/dang-nhap.component';
import { SharedModule } from '../shared/shared.module';
import { DangKyChung1Component } from './dang-ky-chung/dang-ky-chung-1.component';
import { DangKyChung2Component } from './dang-ky-chung/dang-ky-chung-2.component';
import { DangKyChung3Component } from './dang-ky-chung/dang-ky-chung-3.component';
import { NotificationService } from './services/notification.service';

const paramsLoader = (paramsService: ParamsService) => () => paramsService.load();

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    CoreRoutingModule
  ],
  declarations: [
    DangNhapComponent,
    DangKyChung1Component,
    DangKyChung2Component,
    DangKyChung3Component
  ],
  exports: [
    RouterModule,
    DangNhapComponent,
  ],
  providers: [
    StorageService,
    SessionInfoService,
    DataService,
    CryptographyService,
    AuthenticationService,
    AuthenticationGuard,
    HotInfoService,
    NotificationService,
    ParamsService,
    {
      provide: APP_INITIALIZER,
      useFactory: paramsLoader,
      deps: [ParamsService],
      multi: true
    }
  ]
})
export class CoreModule { }
