import { Component,ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guage',
  templateUrl: './guage.component.html',
  styleUrls: ['./guage.component.scss']
})
export class GuageComponent {
    position:any;
    lastPosition:any;
    canSlide:boolean = false;
    maxPoints = 1750;
    minPoints = 0;
    prevVal:number = 0;
    title = 'guage';
    // gaugeType =  'round';
    gaugeValue: any;
    gaugeLabel = 'Speed';
    // gaugeAppendText = 'km/hr';
    gaugeSize = 400;

    constructor(private renderer: Renderer2, private router: Router) {}
    @ViewChild('dail') pointerDail!: ElementRef ;
    @ViewChild('count') pointerTrack!: ElementRef ;
    @ViewChild('right') rightElement!: ElementRef ;
    @ViewChild('left') leftElement!: ElementRef ;
    @ViewChild('contain') outerElement!: ElementRef ;

    callEvent(e:any){
      console.log(e.type);    //e.type == 'mousedown' ? this.rangeSliderInit() : e.type == 'mouseup' ? this.rangeSliderStop() : this.rangeSliderUpdate(e) ;
      if(e.type == 'mousedown' || e.type == 'touchstart'){
        this.rangeSliderInit();
      } else if (e.type == 'mouseup' || e.type == 'mousedown'){
        this.rangeSliderStop();
      } else if (e.type =='mousemove' || e.type == 'touchend'){
        this.rangeSliderUpdate(e);
      }
    }

    pointerEvents(e:any) {
      var pos = { x: 0, y: 0 };

      if ( e.type == "touchstart" ||
        e.type == "touchmove" ||
        e.type == "touchend" ||
        e.type == "touchcancel"
      ) {
        var touch = e.changedTouches[0];
        pos.x = touch.pageX;
        pos.y = touch.pageY;
      } else if (
        e.type == "mousedown" ||
        e.type == "mouseup" ||
        e.type == "mousemove" ||
        e.type == "mouseover" ||
        e.type == "mouseout" ||
        e.type == "mouseenter" ||
        e.type == "mouseleave"
      ) {
        pos.x = e.pageX;
        pos.y = e.pageY;
      }
      return pos;
    }

    rangeSliderInit() {
      this.canSlide = true;
    }

    rangeSliderStop() {
      this.canSlide = false;
    }

    rangeSliderUpdate(e:any){
      if (!this.canSlide || this. maxPoints == 0) return;

      this.position = this.pointerEvents(e);
      const outerEle = this.outerElement.nativeElement.getBoundingClientRect();
      const centerX = outerEle.left + outerEle.width / 2;
      const centerY = outerEle.top + outerEle.height / 2;

      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let deg = Math.ceil((angle * 180) / Math.PI);
      if(deg < 0){
        deg += 360;
      }
      console.log(deg);

      const radius = e.target.offsetWidth / 2;
      if (this.prevVal <= 1 && this.lastPosition - this.position.x >= 0) {
        deg = 0;
      }
      if (this.prevVal >= 359 && this.lastPosition - this.position.x <= 0) {
         deg = 360;
      }

      let x = Math.ceil(centerX + Math.cos(angle) * (outerEle.width / 2)) - 30 ;
      let y = Math.ceil(centerY + Math.sin(angle) * (outerEle.height / 2)) - 155 ;
      if(deg > 269 && deg < 360){
        x = x - 17;
      } else if(deg < 38){
        x = x - 14;
      }else if(deg >= 38 && deg < 49){
        x = x - 8;
      }else if(deg > 162 && deg < 214){
        x = x + 4;
      }else if(deg > 130 && deg < 149){
        x = x - 4;
      }
      let points;
      if(deg >= 136){
        //let degree = deg < 136 ? 136 : deg;
        points = Math.ceil((deg - 136) * 6.473214285714286 ); // It comes from 1450/224
      }else if(deg <= 46){
        //let degree = deg > 47 ? 46 : deg;
        points =  Math.ceil(deg * 6.521739130434783 ) + 1450;
      }

      this.gaugeValue = points;

      const rotateElement = this.pointerDail.nativeElement;

    if(rotateElement && (deg >= 136 || deg <= 45)){
      this.renderer.setStyle(rotateElement, 'transform',`translate(${x}px,${y}px)`);
    }
    }


}
