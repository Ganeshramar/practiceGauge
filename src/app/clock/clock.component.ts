import { Component, ViewChild, ElementRef, Renderer2, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent {

  private timeout: any;

  constructor(private renderer: Renderer2, private elementRef: ElementRef){}

  @ViewChild('hour') hour !: ElementRef;
  @ViewChild('minute') minute !: ElementRef;
  @ViewChild('second') second !: ElementRef;
  ngOnInit():void{
    setInterval(() => {
      this.updateClock();
    })
  }

  updateClock(): void{
    const now = new Date();
    const hour = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = (hour * 30 ) + (0.5 * minutes);
    const minDeg = minutes * 6;
    const secDeg = seconds * 6;

    const hourHand = this.hour.nativeElement;
    const minHand = this.minute.nativeElement;
    const secHand = this.second.nativeElement;

    this.renderer.setStyle(hourHand, 'transform',`rotate(${hourDeg}deg) `);
    this.renderer.setStyle(minHand, 'transform',`rotate(${minDeg}deg) `);
    this.renderer.setStyle(secHand, 'transform',`rotate(${secDeg}deg) `);

  }

  handleLongPress(){
    console.log('Long Press detected with directive');
  }

  onTouchStart(){
    this.timeout = setTimeout(() => {
      console.log('Long Press detected');
    },2000);
  }

  onTouchEnd(){
    clearTimeout(this.timeout);
  }

  onMouseDown(){
    this.timeout = setTimeout(() => {
      console.log('Long Press detected');
    },2000);
  }

  onMouseUp(){
    clearTimeout(this.timeout);
  }
}
