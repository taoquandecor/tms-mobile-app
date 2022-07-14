import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { WorkingStatusDirective } from './directives/working-status.directive';
import { TAlertService } from './services/talert.service';
import { SizeService } from './services/size.service';
import { AutofocusDirective } from './directives/autofocus.directive';
import { AutocompleteSyncDirective } from './directives/autocomplete-sync.directive';
import { DoiMatKhauComponent } from './components/doi-mat-khau/doi-mat-khau.component';

@NgModule({
  imports: [CommonModule,
    FormsModule,
    TranslateModule
  ],
  declarations: [
    WorkingStatusDirective,
    AutofocusDirective,
    AutocompleteSyncDirective,
    DoiMatKhauComponent
  ],
  exports: [WorkingStatusDirective],
  providers: [TAlertService]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,   // name of this module
      providers: [SizeService] // put there the service, that you want to provide globally
    };
  }
}
