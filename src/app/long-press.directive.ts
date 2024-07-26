import { Directive, EventEmitter, Output, ElementRef,HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {
  @Output() longPress = new EventEmitter<void>();

  private isPressing = false;
  private timeout: any;

  constructor(private el:ElementRef) {
    this.el.nativeElement.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.el.nativeElement.addEventListener('touchend', this.onTouchEnd.bind(this));
    this.el.nativeElement.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.el.nativeElement.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onTouchStart(){
    this.isPressing = true;
    this.timeout = setTimeout(() => {
      if(this.isPressing){
        this.longPress.emit();
      }
    },5000);
  }

  onTouchEnd(){
    this.isPressing = false;
    clearTimeout(this.timeout);
  }

  onMouseDown(){
    this.isPressing = true;
    this.timeout = setTimeout(() => {
      if(this.isPressing){
        this.longPress.emit();
      }
    },500);
  }

  onMouseUp(){
    this.isPressing = false;
    clearTimeout(this.timeout);
  }

}
