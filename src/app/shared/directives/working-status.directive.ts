import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({ selector: '[workingStatus]' })
export class WorkingStatusDirective implements OnInit {
  private iElement: any;
  private addspr = true;
  private addspl = true;
  private disabled: any = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.iElement = this.renderer.createElement('i');

    if (this.el.nativeElement) {
      this.renderer.appendChild(this.el.nativeElement, this.iElement);
      this.disabled = this.el.nativeElement.getAttribute('disabled');
      if (this.disabled === '') {
        this.disabled = true;
      }
    }
  }


  @Input()
  set isWorking(working: boolean) {
    if (this.iElement) {
      if (working) {
        this.renderer.setAttribute(this.iElement,
          'class',
          'fa fa-circle-o-notch fa-spin' + (this.addspr ? ' mr-1' : '') + (this.addspl ? ' ml-1' : ''));
        this.renderer.setProperty(this.el.nativeElement, 'disabled', 'true');
      }
      else {
        this.renderer.removeAttribute(this.iElement, 'class');
        this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
      }
    }
  }

  @Input()
  set addSpaceRight(adds: boolean) {
    this.addspr = adds;
  }

  @Input()
  set addSpaceLeft(adds: boolean) {
    this.addspl = adds;
  }
}
