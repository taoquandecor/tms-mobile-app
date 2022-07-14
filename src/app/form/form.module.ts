import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import { MainMenuUserComponent } from './main-menu-user/main-menu-user.component';
import { BanBeService } from './services/ban-be.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgbModule,
    FormRoutingModule,
    SharedModule
  ],
  declarations: [
    FormComponent,
    MainMenuUserComponent
  ],
  providers: [BanBeService]
})
export class FormModule { }
