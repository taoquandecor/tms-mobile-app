import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SizeService {
  public clientHeight: number | undefined;
  public clientWidth: number | undefined;

  private menuHeightChangedSource = new Subject<number>();
  private menuExpanded  = true;
  private menuExpandedHeight = 57;
  private menuCollapsedHeight = 24;

  public menuHeightChange(height: number, expanded: boolean) {
    if (expanded) {
      this.menuCollapsedHeight = height;
    }
    else {
      this.menuExpandedHeight = height;
    }

    this.menuExpanded = expanded;
    this.menuHeightChangedSource.next(height);
  }

  public get menuHeight(): number {
    if (this.menuExpanded) {
      return this.menuExpandedHeight;
    }
    else {
      return this.menuCollapsedHeight;
    }
  }

  public getMenuHeightChangeEvent(): Observable<number> {
    return this.menuHeightChangedSource.asObservable();
  }

  public getHeight(windowHeight: number, delta: number) {
    return (this.clientHeight ? this.clientHeight : windowHeight) - (delta + this.menuHeight);
  }
}
