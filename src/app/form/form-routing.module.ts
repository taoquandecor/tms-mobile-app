import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoiMatKhauComponent } from '../shared/components/doi-mat-khau/doi-mat-khau.component';
import { FormComponent } from './form.component';

const routes: Routes = [
  {
    path: '', component: FormComponent,
    children: [
      { path: 'doi-mat-khau', component: DoiMatKhauComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule { }
