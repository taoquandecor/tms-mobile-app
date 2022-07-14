import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective implements OnInit {
  private mAutofocus: boolean | undefined;
  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (this.mAutofocus || typeof this.mAutofocus === 'undefined')
      {
        this.el.nativeElement.focus();
      }
  }

  @Input() set autofocus(condition: boolean) {
    this.mAutofocus = condition !== false;
  }
}
