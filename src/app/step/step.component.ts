import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent {
  position: any;
  lastPosition: any;
  canSlide: boolean = false;
  prevVal: number = 0;
  overAllPoints: number = 1650; //overall value
  minPoints: number = 300; //rect min postion
  valuePoints: number = 1000; // default value from backend
  maxPoints: number = 1500; // rect max position
  acceleratePoints: number = 1000; // rect max position
  degreeChange: number = (this.overAllPoints * 82.48484848484848) / 100;
  maxDegree: number = 0;
  minDegree:number = 0;
  valDegree:number = 0;

  maxValue: string = "";
  minValue: string = "";

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  @ViewChild('greenElement') greenElement !: ElementRef;
  @ViewChild('blackElement') blackElement !: ElementRef;
  @ViewChild('svgEle') svgEle !: ElementRef;
  @ViewChild('track') track !: ElementRef;
  @ViewChild('leftTag') leftTag !: ElementRef;
  @ViewChild('rightTag') rightTag !: ElementRef;

  ngAfterViewInit() {
    let deg: any;
    let ratio = this.overAllPoints / 274;
    if (this.valuePoints < this.degreeChange) {
      deg = Math.ceil((this.valuePoints / ratio) + 134);
    } else if (this.valuePoints >= this.degreeChange) {
      deg = Math.ceil((this.valuePoints - this.degreeChange) / ratio);
    }
    this.setleftTagPosition();
    this.setRightTagPosition();
    this.updatePosition(deg);
    this.animateProgressBar(this.acceleratePoints);
    // this.animateMaxBar();
  }

  animateProgressBar(points: number) {
    console.log(points);
    //const progress = Math.floor(points * 1000 / this.overAllPoints) / 1000;
    const progress = Math.floor(points * 497 / this.overAllPoints) ;
    const endValue = 497 - progress;
    const green = this.greenElement.nativeElement;
    let maxDeg = (this.maxDegree <= 48) ? this.maxDegree + 360 : this.maxDegree;
    let minDeg = (this.minDegree <= 48) ? this.minDegree - 360 : this.minDegree;
    let degree = (this.valDegree <= 48) ? this.valDegree + 360 : this.valDegree;
    if(minDeg <= degree && degree <= maxDeg){
      green.style['stroke-dashoffset'] = endValue;
    }
  }

  animateMaxBar() {
    const progress = Math.floor(this.maxPoints * 497 / this.overAllPoints) ;
    console.log(this.maxPoints);
    const endValue = 497 - progress;
    const black = this.blackElement.nativeElement;
    // let maxDeg = (this.maxDegree <= 48) ? this.maxDegree + 360 : this.maxDegree;
    // let minDeg = (this.minDegree <= 48) ? this.minDegree - 360 : this.minDegree;
    // let degree = (this.valDegree <= 48) ? this.valDegree + 360 : this.valDegree;
    // if(minDeg < degree && degree < maxDeg){
      black.style['stroke-dashoffset'] = endValue;
    // }
  }

  callEvent(e: any) {
    console.log(e.type);
    this.rangeSliderUpdate(e);
  }

  pointerEvents(e: any) {
    var pos = { x: 0, y: 0 };

    if (e.type == "touchstart" ||
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

  rangeSliderUpdate(e: any) {
    if (!this.canSlide || this.overAllPoints == 0) return;

    this.position = this.pointerEvents(e);
    const outerEle = this.svgEle.nativeElement.getBoundingClientRect();
    const centerX = outerEle.left + 234 / 2;
    const centerY = outerEle.top + 234 / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let deg = Math.ceil((angle * 180) / Math.PI);
    if (deg < 0) {
      deg += 360;
    }
    console.log(deg);
    const radius = outerEle.width / 2;
    this.setPosition(deg, centerX, centerY, angle, radius);
    let points: any;
    let ratio = this.overAllPoints / 274; // It comes from 1650/274(226(360-134) + 48)
    if (deg >= 134) {
      //let degree = deg < 136 ? 136 : deg;
      points = Math.ceil((deg - 134) * ratio);
    } else if (deg <= 48) {
      //let degree = deg > 47 ? 46 : deg;
      points = Math.ceil(deg * ratio) + this.degreeChange;
    }
    this.valDegree = deg;
    this.valuePoints = points;
    this.animateProgressBar(this.acceleratePoints);
    // this.lastPosition = this.position.x;
  }

  changeMaxValue() {
    this.maxPoints = Number(this.maxValue);
    console.log(this.maxPoints);
    this.setRightTagPosition();
  }

  changeMinValue() {
    this.minPoints = Number(this.minValue);
    console.log(this.minPoints);
    this.setleftTagPosition();
  }

  updatePosition(degree: number) {
    const outerEle = this.svgEle.nativeElement.getBoundingClientRect();
    const radius = outerEle.width / 2;
    const angle = degree * (Math.PI / 180);
    const centerX = (outerEle.left) + 234 / 2;
    const centerY = (outerEle.top) + 234 / 2;
    this.setPosition(degree, centerX, centerY, angle, radius);
    this.valDegree = degree;
  }

  setRightTagPosition() {
    let deg: any;
    let ratio = this.overAllPoints / 274;
    if (this.maxPoints < this.degreeChange) {
      deg = Math.ceil((this.maxPoints / ratio) + 134);
    } else if (this.maxPoints >= this.degreeChange) {
      deg = Math.ceil((this.maxPoints - this.degreeChange) / ratio);
    }
    deg = deg == 48 ? 47 : deg;
    const angle = deg * (Math.PI / 180);
    const [xValue, yValue, xPos, yPos, rotation] = this.getTagPosition(deg, angle);
    this.maxDegree = deg;
    let maxDeg = (this.maxDegree <= 48) ? this.maxDegree + 360 : this.maxDegree;
    let minDeg = (this.minDegree <= 48) ? this.minDegree - 360 : this.minDegree;
    let degree = (this.valDegree <= 48) ? this.valDegree + 360 : this.valDegree;
    const rightEle = this.rightTag.nativeElement;
    if (minDeg < maxDeg) {
      if(degree > maxDeg) {
        this.valuePoints = this.maxPoints;
        this.updatePosition(this.maxDegree);
      }
      this.renderer.setStyle(rightEle, 'x', `${xPos}`);
      this.renderer.setStyle(rightEle, 'y', `${yPos}`);
      let transformVal = `rotate(${rotation} ${xValue}, ${yValue})`;
      this.rightTag.nativeElement.setAttribute('transform', transformVal);
      this.animateProgressBar(this.acceleratePoints);
      this.animateMaxBar();
      console.log(`transform="${transformVal}"`, deg);
    }
  }

  setleftTagPosition() {
    let deg: any;
    let ratio = this.overAllPoints / 274;
    if (this.minPoints < this.degreeChange) {
      deg = Math.ceil((this.minPoints / ratio) + 134);
    } else if (this.minPoints >= this.degreeChange) {
      deg = Math.ceil((this.minPoints - this.degreeChange) / ratio);
    }
    deg = deg == 48 ? 47 : deg;
    const angle = deg * (Math.PI / 180);
    const [xValue, yValue, xPos, yPos, rotation] = this.getTagPosition(deg, angle);
    this.minDegree = deg;
    let maxDeg = (this.maxDegree <= 48) ? this.maxDegree + 360 : this.maxDegree;
    let minDeg = (this.minDegree <= 48) ? this.minDegree - 360 : this.minDegree;
    let degree = (this.valDegree <= 48) ? this.valDegree + 360 : this.valDegree;
    const lefttEle = this.leftTag.nativeElement;
    if (minDeg < maxDeg) {
      if(degree < minDeg){
        this.updatePosition(this.minDegree);
      }
      this.renderer.setStyle(lefttEle, 'x', `${xPos}`);
      this.renderer.setStyle(lefttEle, 'y', `${yPos}`);
      let transformVal = `rotate(${rotation} ${xValue}, ${yValue})`;
      this.leftTag.nativeElement.setAttribute('transform', transformVal);
      console.log(`transform="${transformVal}"`, deg);
    }
  }

  getTagPosition(deg:number,angle:number){
    const centerX = 8 + 234 / 2; //rightElement.left + 234/ 2;
    const centerY = 8 + 234 / 2; //rightElement.top + 234 / 2;
    if (deg < 0) {
      deg += 360;
    }
    console.log(deg);
    const outerEle = this.svgEle.nativeElement.getBoundingClientRect();
    const radius = outerEle.width / 2;
    let xVal = Math.ceil(centerX + (Math.cos(angle) * radius));
    let yVal = Math.ceil(centerY + (Math.sin(angle) * radius));
    // let[x, y] = this.getXY(deg,xVal,yVal);
    // alert(xVal+''+deg)
    let xPos = 0;
    let yPos = 0;
    if((deg >= 270 && deg <=360) || (deg <=48)){
      xPos =  (deg >= 270 && deg < 293) ? xVal - 9 : (deg >= 293 && deg < 304) ? xVal - 11 : (deg >= 304 && deg < 326) ? xVal - 12 : (deg >= 326 && deg < 337) ? xVal - 15 : (deg >= 326 && deg < 337) ? xVal - 14 : (deg >= 342 && deg < 357) ? xVal - 16 : (deg >= 358 || deg < 2) ? xVal - 17 : (deg >= 2 && deg < 18) ? xVal - 21 : (deg >= 18 && deg < 32) ? xVal - 22 : (deg >= 32 && deg < 46) ? xVal - 24 : (deg >= 46 && deg < 48) ? xVal - 22 : xVal;
      yPos = (deg >= 270 && deg < 304) ? yVal + 4 : (deg >= 304 && deg < 342) ? yVal  : (deg >= 342 || deg < 24) ? yVal - 1 : (deg >= 24 && deg < 40) ? yVal - 2 : yVal;
    }else{
      xPos = (deg >= 138 && deg < 144) ? xVal + 8 : (deg >= 144 && deg < 151) ? xVal + 7 :  (deg >= 151 && deg < 185) ? xVal - 5 : (deg >= 185 && deg < 191) ? xVal - 6 : (deg >= 191 && deg < 212) ? xVal - 6 : (deg >= 212 && deg < 242) ? xVal - 7 : (deg >= 242 && deg < 267) ? xVal - 8 : xVal - 6 ; //(deg >= 267 && deg < 270) ? xVal - 6;
      yPos = (deg >= 134 && deg < 191) ? yVal + 4 : (deg >= 191 && deg < 209) ? yVal + 5 : (deg >= 209 && deg < 227) ? yVal + 6 : (deg >= 227 && deg < 267) ? yVal + 5 :  yVal + 4 ; //(deg >= 267 && deg < 270) ? yVal + 3;
    }
    let rotation = 90;
    if (deg > 270 || deg <= 360) {
      rotation = (deg - 270);//* 0.9278350515463918; //  90/97 (367(center point) - 270 = 270)
    } else if (deg < 270 || deg <= 180) {
      rotation = -(deg - 180); // * 0.9473684210526315); //  90/95
    } else if (deg < 180 || deg >= 134) {
      rotation = -(deg - 90); //((deg - 90) * 1.0588235294117647) + 90); // 90/85
    } else if (deg > 0 || deg < 48) {
      rotation = (deg);// * 1.0843373493975903) + 90); // 90/83
    }
    let xValue = xVal - 11;
    let yValue = yVal + 2;
    return [xValue, yValue,xPos,yPos,rotation];
  }



  setPosition(deg: number, centerX: number, centerY: number, angle: number, radius: number) {
    const rotateElement = this.track.nativeElement;
    let xVal = Math.ceil(centerX + (Math.cos(angle) * radius));
    let yVal = Math.ceil(centerY + (Math.sin(angle) * radius) - 230);
    const [x, y] = this.getXY(deg, xVal, yVal);
    let maxDeg = (this.maxDegree <= 48) ? this.maxDegree + 360 : this.maxDegree;
    let minDeg = (this.minDegree <= 48) ? this.minDegree - 360 : this.minDegree;
    let degree = (deg <= 48) ? deg + 360 : deg;
    // console.log(this.minDegree,this.maxDegree, deg);
    if( degree >= minDeg && degree <= maxDeg){
      // if (deg >= 134) {
      console.log(`transform="translate(${x}px,${y}px) "`, degree);
      this.renderer.setStyle(rotateElement, 'transform', `translate(${x}px,${y}px) `);
      // } else if (deg <= 48) {
      //   this.renderer.setStyle(rotateElement, 'transform', `translate(${x}px,${y}px) `);
      // }
    }
  }

  getXY(deg: number, x: number, y: number) {
    let xVal, yVal;
    if (deg >= 134 && deg < 147) {
      xVal = x - 18;
      yVal = y - 16;
    } else if (deg >= 147 && deg < 157) {
      xVal = x - 14;
      yVal = y - 14;
    } else if (deg >= 157 && deg <= 165) {
      xVal = x - 10;
      yVal = y - 10;
    } else if (deg > 165 && deg <= 178) {
      xVal = x - 8;
      yVal = y - 8;
    } else if (deg > 178 && deg < 188) {
      xVal = x - 8;
      yVal = y - 6;
    } else if (deg >= 188 && deg <= 204) {
      yVal = y;
      xVal = x - 8;
    } else if (deg > 204 && deg < 218) {
      yVal = y;
      xVal = x - 5;
    } else if (deg <= 48 && deg > 32) {
      xVal = x - 18;
      yVal = y - 10;
    } else if (deg <= 32 && deg > 18) {
      xVal = x - 22;
      yVal = y - 8;
    } else if (deg <= 18) {
      yVal = y - 6;
      xVal = x - 24;
    } else if (deg < 360 && deg > 342) {
      xVal = x - 26;
      yVal = y - 8;
    } else if (deg <= 342 && deg > 328) {
      xVal = x - 29;
      yVal = y - 5;
    }else if (deg <= 328 && deg > 316) {
      xVal = x - 29;
      yVal = y - 2;
    } else if (deg <= 316 && deg > 302) {
      xVal = x - 28;
      yVal = y + 2;
    } else if (deg <= 302 && deg > 278) {
      xVal = x - 18;
      yVal = y + 10;
    } else if (deg <= 278 && deg > 256) {
      xVal = x - 12;
      yVal = y + 9;
    } else if (deg <= 256 && deg > 246) {
      xVal = x - 6;
      yVal = y + 6;
    } else if (deg <= 246 && deg > 236) {
      xVal = x - 4;
      yVal = y + 3;
    } else if (deg <= 236 && deg > 225) {
      xVal = x - 2;
      yVal = y - 1;
    } else if (deg <= 225 && deg > 217) {
      xVal = x - 4;
      yVal = y - 2;
    }else {
      xVal = x;
      yVal = y;
    }
    return [xVal, yVal];
  }

  // const conditions = [
  //   {degRange : [134,147], xVal:-18,yVal:-16},
  //   {degRange : [147,157], xVal:-14,yVal:-14},
  //   {degRange : [157,165], xVal:-10,yVal:-10},
  //   {degRange : [165,178], xVal:-8,yVal:-8},
  //   {degRange : [178,188], xVal:-6,yVal:-6},
  //   {degRange : [188,204], xVal:-6,yVal:0},
  //   {degRange : [204,218], xVal:-4,yVal:0},
  //   {degRange : [217,225], xVal:-2,yVal:-2},
  //   {degRange : [236,246], xVal:-2,yVal:2},
  //   {degRange : [246,256], xVal:-6,yVal:6},
  //   {degRange : [256,278], xVal:-10,yVal:8},
  //   {degRange : [278,302], xVal:-18,yVal:8},
  //   {degRange : [302,316], xVal:-28,yVal:2},
  //   {degRange : [316,328], xVal:-32,yVal:-4},
  //   {degRange : [328,342], xVal:-28,yVal:-6},
  // ]

}
