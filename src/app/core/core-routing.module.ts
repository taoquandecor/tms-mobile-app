import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DangKyChung1Component } from './dang-ky-chung/dang-ky-chung-1.component';
import { DangKyChung2Component } from './dang-ky-chung/dang-ky-chung-2.component';
import { DangKyChung3Component } from './dang-ky-chung/dang-ky-chung-3.component';
import { DangNhapComponent } from './dang-nhap/dang-nhap.component';
import { AuthenticationGuard } from './services/authentication.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'form',
    pathMatch: 'full'
  },
  {
    path: 'form',
    loadChildren: () => import('../form/form.module').then(m => m.FormModule),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'dang-nhap',
    component: DangNhapComponent
  },
  {
    path: 'dang-ky',
    component: DangKyChung1Component
  },
  {
    path: 'dang-ky-tt/:p',
    component: DangKyChung2Component
  },
  {
    path: 'dang-ky-kq',
    component: DangKyChung3Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
