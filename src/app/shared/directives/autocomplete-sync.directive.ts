import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({ selector: '[autocompleteSync]' })
export class AutocompleteSyncDirective {
  constructor(private el: ElementRef, private ngModel: NgModel) { }

  @HostListener('input', ['$event', '$event.target.value'])
  @HostListener('blur', ['$event', '$event.target.value'])
  onBlur(event: any, value: any) {
    if (this.ngModel.viewModel !== value) {
      this.ngModel.viewModel = value;
      // Nếu gọi hàm dưới đây nó sẽ thực hiện this.ngModel.viewModel = v và emit ngModelChange event
      //this.ngModel.viewToModelUpdate(v);
    }
  }
}
